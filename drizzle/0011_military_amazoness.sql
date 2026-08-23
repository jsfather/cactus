ALTER TABLE "users" ADD COLUMN "password_failed_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_locked_until" timestamp with time zone;