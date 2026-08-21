ALTER TABLE "posts" ADD COLUMN "tags" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_title_fa" varchar(70);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_title_en" varchar(70);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_description_fa" varchar(170);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_description_en" varchar(170);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "seo_image_url" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "no_index" boolean DEFAULT false NOT NULL;