ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TYPE "public"."user_role" RENAME TO "user_role_legacy";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM ('admin', 'teacher', 'student', 'member');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."user_role" USING "role"::text::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'member';--> statement-breakpoint
DROP TYPE "public"."user_role_legacy";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name_fa" varchar(80);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name_fa" varchar(80);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name_en" varchar(80);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name_en" varchar(80);--> statement-breakpoint
UPDATE "users" SET
  "first_name_fa" = left(split_part(btrim("name_fa"), ' ', 1), 80),
  "last_name_fa" = left(CASE WHEN strpos(btrim("name_fa"), ' ') > 0 THEN ltrim(substr(btrim("name_fa"), strpos(btrim("name_fa"), ' ') + 1)) ELSE btrim("name_fa") END, 80),
  "first_name_en" = left(split_part(btrim("name_en"), ' ', 1), 80),
  "last_name_en" = left(CASE WHEN strpos(btrim("name_en"), ' ') > 0 THEN ltrim(substr(btrim("name_en"), strpos(btrim("name_en"), ' ') + 1)) ELSE btrim("name_en") END, 80);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name_fa" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_name_fa" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name_en" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_name_en" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name_fa";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name_en";
