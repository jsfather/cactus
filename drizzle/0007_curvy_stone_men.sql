CREATE TYPE "public"."exam_question_type" AS ENUM('single_choice', 'multiple_choice', 'true_false', 'short_answer');--> statement-breakpoint
CREATE TYPE "public"."exam_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "exam_question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"label_fa" text NOT NULL,
	"label_en" text,
	"is_correct" boolean DEFAULT false NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"type" "exam_question_type" NOT NULL,
	"prompt_fa" text NOT NULL,
	"prompt_en" text,
	"explanation_fa" text,
	"explanation_en" text,
	"points" integer DEFAULT 1 NOT NULL,
	"sort_order" integer NOT NULL,
	"correct_boolean" boolean,
	"correct_answer_fa" text,
	"correct_answer_en" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_fa" varchar(240) NOT NULL,
	"title_en" varchar(240),
	"description_fa" text,
	"description_en" text,
	"instructions_fa" text,
	"instructions_en" text,
	"status" "exam_status" DEFAULT 'draft' NOT NULL,
	"duration_minutes" integer,
	"passing_score" integer DEFAULT 60 NOT NULL,
	"shuffle_questions" boolean DEFAULT false NOT NULL,
	"shuffle_options" boolean DEFAULT false NOT NULL,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exam_question_options" ADD CONSTRAINT "exam_question_options_question_id_exam_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."exam_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "exam_question_options_question_sort_order_unique" ON "exam_question_options" USING btree ("question_id","sort_order");--> statement-breakpoint
CREATE INDEX "exam_question_options_question_id_index" ON "exam_question_options" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_questions_exam_sort_order_unique" ON "exam_questions" USING btree ("exam_id","sort_order");--> statement-breakpoint
CREATE INDEX "exam_questions_exam_id_index" ON "exam_questions" USING btree ("exam_id");--> statement-breakpoint
CREATE INDEX "exams_status_updated_at_index" ON "exams" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "exams_creator_id_index" ON "exams" USING btree ("creator_id");