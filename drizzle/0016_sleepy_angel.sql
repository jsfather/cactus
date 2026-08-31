CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'excused');--> statement-breakpoint
CREATE TABLE "session_student_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"attendance" "attendance_status",
	"grade" numeric(6, 2),
	"note" varchar(500),
	"recorded_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_student_records_grade_check" CHECK ("session_student_records"."grade" is null or ("session_student_records"."grade" >= 0 and "session_student_records"."grade" <= 1000)),
	CONSTRAINT "session_student_records_has_value_check" CHECK ("session_student_records"."attendance" is not null or "session_student_records"."grade" is not null or nullif(btrim("session_student_records"."note"), '') is not null)
);
--> statement-breakpoint
CREATE TABLE "term_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term_id" uuid NOT NULL,
	"session_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"sequence" integer NOT NULL,
	"grade_max" numeric(6, 2) DEFAULT '20' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "term_sessions_time_check" CHECK ("term_sessions"."end_time" > "term_sessions"."start_time"),
	CONSTRAINT "term_sessions_sequence_check" CHECK ("term_sessions"."sequence" > 0),
	CONSTRAINT "term_sessions_grade_max_check" CHECK ("term_sessions"."grade_max" > 0 and "term_sessions"."grade_max" <= 1000)
);
--> statement-breakpoint
ALTER TABLE "session_student_records" ADD CONSTRAINT "session_student_records_session_id_term_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."term_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_student_records" ADD CONSTRAINT "session_student_records_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_student_records" ADD CONSTRAINT "session_student_records_recorded_by_id_users_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_sessions" ADD CONSTRAINT "term_sessions_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "session_student_records_session_student_unique" ON "session_student_records" USING btree ("session_id","student_id");--> statement-breakpoint
CREATE INDEX "session_student_records_student_index" ON "session_student_records" USING btree ("student_id","session_id");--> statement-breakpoint
CREATE INDEX "session_student_records_recorder_index" ON "session_student_records" USING btree ("recorded_by_id");--> statement-breakpoint
CREATE UNIQUE INDEX "term_sessions_term_date_time_unique" ON "term_sessions" USING btree ("term_id","session_date","start_time");--> statement-breakpoint
CREATE UNIQUE INDEX "term_sessions_term_sequence_unique" ON "term_sessions" USING btree ("term_id","sequence");--> statement-breakpoint
CREATE INDEX "term_sessions_term_date_index" ON "term_sessions" USING btree ("term_id","session_date","start_time");--> statement-breakpoint
WITH generated_sessions AS (
	SELECT
		term.id AS term_id,
		generated.day_value::date AS session_date,
		schedule.start_time,
		schedule.end_time,
		row_number() OVER (
			PARTITION BY term.id
			ORDER BY generated.day_value, schedule.start_time
		)::integer AS sequence
	FROM terms term
	JOIN LATERAL generate_series(term.start_date::timestamp, term.end_date::timestamp, interval '1 day') AS generated(day_value) ON true
	JOIN term_schedules schedule
		ON schedule.term_id = term.id
		AND extract(dow FROM generated.day_value)::integer = ((schedule.day_of_week + 6) % 7)
)
INSERT INTO term_sessions (term_id, session_date, start_time, end_time, sequence)
SELECT term_id, session_date, start_time, end_time, sequence
FROM generated_sessions
ORDER BY term_id, sequence;
