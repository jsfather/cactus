CREATE TABLE "academic_semesters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year_id" uuid NOT NULL,
	"title_fa" varchar(160) NOT NULL,
	"title_en" varchar(160),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "academic_semester_date_range" CHECK ("academic_semesters"."end_date" >= "academic_semesters"."start_date")
);
--> statement-breakpoint
CREATE TABLE "academic_years" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_fa" varchar(160) NOT NULL,
	"title_en" varchar(160),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	CONSTRAINT "academic_year_date_range" CHECK ("academic_years"."end_date" >= "academic_years"."start_date")
);
--> statement-breakpoint
CREATE TABLE "chat_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_hash" varchar(64) NOT NULL,
	"name" varchar(160) NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"locale" varchar(2) DEFAULT 'fa' NOT NULL,
	"operator_id" uuid,
	"status" varchar(12) DEFAULT 'open' NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_status_check" CHECK ("chat_conversations"."status" in ('open', 'closed'))
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender" varchar(12) NOT NULL,
	"author_id" uuid,
	"body" text NOT NULL,
	"image_path" text,
	"image_mime" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_sender_check" CHECK ("chat_messages"."sender" in ('visitor', 'operator', 'system'))
);
--> statement-breakpoint
CREATE TABLE "chat_operator_presence" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_fa" varchar(240) NOT NULL,
	"title_en" varchar(240),
	"description_fa" text,
	"description_en" text,
	"level_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "terms" ADD COLUMN "semester_id" uuid;--> statement-breakpoint
ALTER TABLE "terms" ADD COLUMN "course_template_id" uuid;--> statement-breakpoint
ALTER TABLE "terms" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "rating" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "rating_responder_id" uuid;--> statement-breakpoint
ALTER TABLE "academic_semesters" ADD CONSTRAINT "academic_semesters_year_id_academic_years_id_fk" FOREIGN KEY ("year_id") REFERENCES "public"."academic_years"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_operator_id_users_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_operator_presence" ADD CONSTRAINT "chat_operator_presence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_templates" ADD CONSTRAINT "course_templates_level_id_term_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."term_levels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_visitor_history_idx" ON "chat_conversations" USING btree ("visitor_hash","created_at");--> statement-breakpoint
CREATE INDEX "chat_operator_status_idx" ON "chat_conversations" USING btree ("operator_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_one_open_visitor_idx" ON "chat_conversations" USING btree ("visitor_hash") WHERE "chat_conversations"."status" = 'open';--> statement-breakpoint
CREATE INDEX "chat_messages_conversation_idx" ON "chat_messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_semester_id_academic_semesters_id_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."academic_semesters"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_course_template_id_course_templates_id_fk" FOREIGN KEY ("course_template_id") REFERENCES "public"."course_templates"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_rating_responder_id_users_id_fk" FOREIGN KEY ("rating_responder_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_rating_range" CHECK ("tickets"."rating" between 1 and 5);