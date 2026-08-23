CREATE TYPE "public"."otp_purpose" AS ENUM('login', 'register');--> statement-breakpoint
CREATE TABLE "otp_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mobile" varchar(11) NOT NULL,
	"purpose" "otp_purpose" NOT NULL,
	"code_hash" varchar(64) NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile" varchar(64);--> statement-breakpoint
UPDATE "users" SET "mobile" = 'legacy:' || "id"::text WHERE "mobile" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "mobile" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "otp_challenges_mobile_purpose_created_index" ON "otp_challenges" USING btree ("mobile","purpose","created_at");--> statement-breakpoint
CREATE INDEX "otp_challenges_expires_at_index" ON "otp_challenges" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_mobile_unique" ON "users" USING btree ("mobile");
