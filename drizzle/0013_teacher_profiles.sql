CREATE TABLE "teacher_educations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_profile_id" uuid NOT NULL,
	"institution_fa" varchar(180) NOT NULL,
	"institution_en" varchar(180),
	"degree_fa" varchar(160) NOT NULL,
	"degree_en" varchar(160),
	"field_fa" varchar(180) NOT NULL,
	"field_en" varchar(180),
	"period_fa" varchar(120) NOT NULL,
	"period_en" varchar(120),
	"description_fa" text,
	"description_en" text,
	"sort_order" integer NOT NULL,
	CONSTRAINT "teacher_educations_sort_order_check" CHECK ("teacher_educations"."sort_order" > 0)
);
--> statement-breakpoint
CREATE TABLE "teacher_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"username" varchar(32) NOT NULL,
	"national_code" varchar(10) NOT NULL,
	"city_fa" varchar(120) NOT NULL,
	"city_en" varchar(120),
	"biography_fa" text NOT NULL,
	"biography_en" text,
	"about_fa" text NOT NULL,
	"about_en" text,
	"achievements_fa" text,
	"achievements_en" text,
	"member_since" date NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_profile_id" uuid NOT NULL,
	"name_fa" varchar(120) NOT NULL,
	"name_en" varchar(120),
	"score" integer NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "teacher_skills_score_check" CHECK ("teacher_skills"."score" between 0 and 100),
	CONSTRAINT "teacher_skills_sort_order_check" CHECK ("teacher_skills"."sort_order" > 0)
);
--> statement-breakpoint
CREATE TABLE "teacher_work_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_profile_id" uuid NOT NULL,
	"company_fa" varchar(180) NOT NULL,
	"company_en" varchar(180),
	"position_fa" varchar(180) NOT NULL,
	"position_en" varchar(180),
	"period_fa" varchar(120) NOT NULL,
	"period_en" varchar(120),
	"description_fa" text,
	"description_en" text,
	"sort_order" integer NOT NULL,
	CONSTRAINT "teacher_work_experiences_sort_order_check" CHECK ("teacher_work_experiences"."sort_order" > 0)
);
--> statement-breakpoint
ALTER TABLE "teacher_educations" ADD CONSTRAINT "teacher_educations_teacher_profile_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_profile_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_skills" ADD CONSTRAINT "teacher_skills_teacher_profile_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_profile_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_work_experiences" ADD CONSTRAINT "teacher_work_experiences_teacher_profile_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_profile_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_educations_profile_sort_unique" ON "teacher_educations" USING btree ("teacher_profile_id","sort_order");--> statement-breakpoint
CREATE INDEX "teacher_educations_profile_index" ON "teacher_educations" USING btree ("teacher_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_profiles_user_unique" ON "teacher_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_profiles_username_unique" ON "teacher_profiles" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_profiles_national_code_unique" ON "teacher_profiles" USING btree ("national_code");--> statement-breakpoint
CREATE INDEX "teacher_profiles_public_updated_index" ON "teacher_profiles" USING btree ("is_public","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_skills_profile_sort_unique" ON "teacher_skills" USING btree ("teacher_profile_id","sort_order");--> statement-breakpoint
CREATE INDEX "teacher_skills_profile_index" ON "teacher_skills" USING btree ("teacher_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_work_experiences_profile_sort_unique" ON "teacher_work_experiences" USING btree ("teacher_profile_id","sort_order");--> statement-breakpoint
CREATE INDEX "teacher_work_experiences_profile_index" ON "teacher_work_experiences" USING btree ("teacher_profile_id");