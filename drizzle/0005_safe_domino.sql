ALTER TABLE "media_assets" ADD COLUMN "alt_fa" varchar(240);--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "alt_en" varchar(240);--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;