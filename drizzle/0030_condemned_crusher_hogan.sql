CREATE TABLE "access_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_fa" varchar(160) NOT NULL,
	"title_en" varchar(160) NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "amount_toman" bigint;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "gateway_code" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "checked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "access_profile_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_access_profile_id_access_profiles_id_fk" FOREIGN KEY ("access_profile_id") REFERENCES "public"."access_profiles"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM "app_settings" WHERE "key" = 'seed.access-profiles.v1') THEN
    INSERT INTO "access_profiles" ("title_fa", "title_en", "permissions") VALUES
      ('پشتیبانی', 'Support', '["support"]'::jsonb),
      ('کارشناس سئو', 'SEO specialist', '["seo","content","media"]'::jsonb),
      ('امور مالی', 'Finance', '["finance"]'::jsonb);
    INSERT INTO "app_settings" ("key", "value") VALUES ('seed.access-profiles.v1', 'complete');
  END IF;
END $$;
