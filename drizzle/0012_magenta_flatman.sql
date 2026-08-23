CREATE TYPE "public"."student_allergy_status" AS ENUM('none', 'has_allergy');--> statement-breakpoint
CREATE TYPE "public"."student_document_kind" AS ENUM('national_card', 'education_certificate');--> statement-breakpoint
CREATE TYPE "public"."student_information_status" AS ENUM('draft', 'pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "student_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "student_document_kind" NOT NULL,
	"pathname" text NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"username" varchar(32) NOT NULL,
	"national_code" varchar(10),
	"birth_date" date NOT NULL,
	"education_level_fa" varchar(120) NOT NULL,
	"education_level_en" varchar(120),
	"father_name_fa" varchar(160) NOT NULL,
	"father_name_en" varchar(160),
	"mother_name_fa" varchar(160) NOT NULL,
	"mother_name_en" varchar(160),
	"father_occupation_fa" varchar(180) NOT NULL,
	"father_occupation_en" varchar(180),
	"mother_occupation_fa" varchar(180) NOT NULL,
	"mother_occupation_en" varchar(180),
	"allergy_status" "student_allergy_status" NOT NULL,
	"allergy_description_fa" varchar(500),
	"allergy_description_en" varchar(500),
	"interest_level" integer NOT NULL,
	"focus_level" integer NOT NULL,
	"status" "student_information_status" DEFAULT 'draft' NOT NULL,
	"rejection_reason" text,
	"submitted_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"reviewed_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_information_interest_level_check" CHECK ("student_information"."interest_level" between 1 and 100),
	CONSTRAINT "student_information_focus_level_check" CHECK ("student_information"."focus_level" between 1 and 100),
	CONSTRAINT "student_information_allergy_description_check" CHECK ("student_information"."allergy_status" = 'none' or nullif(btrim("student_information"."allergy_description_fa"), '') is not null)
);
--> statement-breakpoint
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_information" ADD CONSTRAINT "student_information_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_information" ADD CONSTRAINT "student_information_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "student_documents_user_kind_unique" ON "student_documents" USING btree ("user_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "student_documents_pathname_unique" ON "student_documents" USING btree ("pathname");--> statement-breakpoint
CREATE INDEX "student_documents_user_index" ON "student_documents" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_information_user_unique" ON "student_information" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_information_username_unique" ON "student_information" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "student_information_national_code_unique" ON "student_information" USING btree ("national_code");--> statement-breakpoint
CREATE INDEX "student_information_status_submitted_index" ON "student_information" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE INDEX "student_information_reviewer_index" ON "student_information" USING btree ("reviewed_by_id");