CREATE TYPE "public"."term_delivery_mode" AS ENUM('in_person', 'online', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."term_enrollment_source" AS ENUM('direct', 'invitation');--> statement-breakpoint
CREATE TYPE "public"."term_enrollment_status" AS ENUM('active', 'withdrawn', 'completed');--> statement-breakpoint
CREATE TYPE "public"."term_status" AS ENUM('draft', 'enrollment_open', 'active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "term_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"status" "term_enrollment_status" DEFAULT 'active' NOT NULL,
	"source" "term_enrollment_source" NOT NULL,
	"enrolled_by_id" uuid,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "term_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term_id" uuid NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"max_uses" integer,
	"use_count" integer DEFAULT 0 NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "term_invitations_max_uses_check" CHECK ("term_invitations"."max_uses" is null or "term_invitations"."max_uses" > 0),
	CONSTRAINT "term_invitations_use_count_check" CHECK ("term_invitations"."use_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "term_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_fa" varchar(160) NOT NULL,
	"title_en" varchar(160),
	"description_fa" text,
	"description_en" text,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "term_levels_sort_order_check" CHECK ("term_levels"."sort_order" > 0)
);
--> statement-breakpoint
CREATE TABLE "term_prerequisites" (
	"term_id" uuid NOT NULL,
	"prerequisite_term_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "term_prerequisites_not_self_check" CHECK ("term_prerequisites"."term_id" <> "term_prerequisites"."prerequisite_term_id")
);
--> statement-breakpoint
CREATE TABLE "term_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "term_schedules_day_check" CHECK ("term_schedules"."day_of_week" between 0 and 6),
	CONSTRAINT "term_schedules_time_check" CHECK ("term_schedules"."end_time" > "term_schedules"."start_time")
);
--> statement-breakpoint
CREATE TABLE "term_teachers" (
	"term_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"assigned_by_id" uuid,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_fa" varchar(240) NOT NULL,
	"title_en" varchar(240),
	"description_fa" text,
	"description_en" text,
	"level_id" uuid NOT NULL,
	"status" "term_status" DEFAULT 'draft' NOT NULL,
	"delivery_mode" "term_delivery_mode" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"capacity" integer,
	"tuition_toman" bigint DEFAULT 0 NOT NULL,
	"location_fa" varchar(500),
	"location_en" varchar(500),
	"meeting_url" text,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "terms_date_range_check" CHECK ("terms"."end_date" >= "terms"."start_date"),
	CONSTRAINT "terms_capacity_check" CHECK ("terms"."capacity" is null or "terms"."capacity" > 0),
	CONSTRAINT "terms_tuition_check" CHECK ("terms"."tuition_toman" >= 0),
	CONSTRAINT "terms_delivery_details_check" CHECK ((
        ("terms"."delivery_mode" = 'in_person' and nullif(btrim("terms"."location_fa"), '') is not null)
        or ("terms"."delivery_mode" = 'online' and nullif(btrim("terms"."meeting_url"), '') is not null)
        or ("terms"."delivery_mode" = 'hybrid' and nullif(btrim("terms"."location_fa"), '') is not null and nullif(btrim("terms"."meeting_url"), '') is not null)
      ))
);
--> statement-breakpoint
ALTER TABLE "term_enrollments" ADD CONSTRAINT "term_enrollments_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_enrollments" ADD CONSTRAINT "term_enrollments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_enrollments" ADD CONSTRAINT "term_enrollments_enrolled_by_id_users_id_fk" FOREIGN KEY ("enrolled_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_invitations" ADD CONSTRAINT "term_invitations_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_invitations" ADD CONSTRAINT "term_invitations_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_prerequisites" ADD CONSTRAINT "term_prerequisites_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_prerequisites" ADD CONSTRAINT "term_prerequisites_prerequisite_term_id_terms_id_fk" FOREIGN KEY ("prerequisite_term_id") REFERENCES "public"."terms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_schedules" ADD CONSTRAINT "term_schedules_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_teachers" ADD CONSTRAINT "term_teachers_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_teachers" ADD CONSTRAINT "term_teachers_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_teachers" ADD CONSTRAINT "term_teachers_assigned_by_id_users_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_level_id_term_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."term_levels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "term_enrollments_term_student_unique" ON "term_enrollments" USING btree ("term_id","student_id");--> statement-breakpoint
CREATE INDEX "term_enrollments_student_status_index" ON "term_enrollments" USING btree ("student_id","status");--> statement-breakpoint
CREATE INDEX "term_enrollments_term_status_index" ON "term_enrollments" USING btree ("term_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "term_invitations_token_hash_unique" ON "term_invitations" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "term_invitations_term_created_index" ON "term_invitations" USING btree ("term_id","created_at");--> statement-breakpoint
CREATE INDEX "term_invitations_expiry_index" ON "term_invitations" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "term_levels_title_fa_unique" ON "term_levels" USING btree ("title_fa");--> statement-breakpoint
CREATE UNIQUE INDEX "term_levels_sort_order_unique" ON "term_levels" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "term_prerequisites_unique" ON "term_prerequisites" USING btree ("term_id","prerequisite_term_id");--> statement-breakpoint
CREATE INDEX "term_prerequisites_prerequisite_index" ON "term_prerequisites" USING btree ("prerequisite_term_id");--> statement-breakpoint
CREATE UNIQUE INDEX "term_schedules_term_slot_unique" ON "term_schedules" USING btree ("term_id","day_of_week","start_time");--> statement-breakpoint
CREATE INDEX "term_schedules_term_day_index" ON "term_schedules" USING btree ("term_id","day_of_week","start_time");--> statement-breakpoint
CREATE UNIQUE INDEX "term_teachers_unique" ON "term_teachers" USING btree ("term_id","teacher_id");--> statement-breakpoint
CREATE INDEX "term_teachers_teacher_index" ON "term_teachers" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "terms_level_status_dates_index" ON "terms" USING btree ("level_id","status","start_date","end_date");--> statement-breakpoint
CREATE INDEX "terms_status_dates_index" ON "terms" USING btree ("status","start_date","end_date");--> statement-breakpoint
CREATE INDEX "terms_creator_id_index" ON "terms" USING btree ("creator_id");
--> statement-breakpoint
CREATE FUNCTION "ensure_term_has_teacher_and_schedule"() RETURNS trigger AS $$
DECLARE
  checked_term_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'terms' THEN
    IF TG_OP = 'DELETE' THEN
      checked_term_id := OLD.id;
    ELSE
      checked_term_id := NEW.id;
    END IF;
  ELSE
    IF TG_OP = 'DELETE' THEN
      checked_term_id := OLD.term_id;
    ELSE
      checked_term_id := NEW.term_id;
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM terms WHERE id = checked_term_id) THEN
    IF NOT EXISTS (SELECT 1 FROM term_teachers WHERE term_id = checked_term_id) THEN
      RAISE EXCEPTION 'A term must have at least one teacher' USING ERRCODE = '23514';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM term_schedules WHERE term_id = checked_term_id) THEN
      RAISE EXCEPTION 'A term must have at least one weekly schedule' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER "terms_require_teacher_and_schedule" AFTER INSERT OR UPDATE ON "terms" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ensure_term_has_teacher_and_schedule"();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER "term_teachers_keep_one" AFTER INSERT OR UPDATE OR DELETE ON "term_teachers" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ensure_term_has_teacher_and_schedule"();
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER "term_schedules_keep_one" AFTER INSERT OR UPDATE OR DELETE ON "term_schedules" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ensure_term_has_teacher_and_schedule"();
