ALTER TABLE "resources" ADD COLUMN "category_fa" varchar(120);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "category_en" varchar(120);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "platforms" varchar(240);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "version" varchar(120);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "documentation_url" text;