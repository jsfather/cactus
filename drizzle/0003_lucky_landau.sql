ALTER TABLE "users" RENAME COLUMN "name" TO "name_fa";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name_en" varchar(120);--> statement-breakpoint
UPDATE "users"
SET "name_en" = CASE
  WHEN "email" = 'teacher.example@cactus.local' THEN 'Cactus Demo Teacher'
  WHEN "email" = 'student.example@cactus.local' THEN 'Cactus Demo Student'
  WHEN split_part("email", '@', 1) ~ '^[A-Za-z0-9._+-]+$'
    THEN initcap(regexp_replace(split_part("email", '@', 1), '[._+-]+', ' ', 'g'))
  ELSE 'User ' || upper(left("id"::text, 8))
END;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name_en" SET NOT NULL;
