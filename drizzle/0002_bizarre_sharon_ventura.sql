CREATE TYPE "public"."media_kind" AS ENUM('avatar', 'post', 'product', 'content');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"kind" "media_kind" NOT NULL,
	"uploader_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title_fa" varchar(240) NOT NULL,
	"title_en" varchar(240),
	"summary_fa" text NOT NULL,
	"summary_en" text,
	"content_fa" text NOT NULL,
	"content_en" text,
	"price" bigint NOT NULL,
	"inventory" integer DEFAULT 0 NOT NULL,
	"cover_image_url" text,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"author_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio_fa" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio_en" text;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_url_unique" ON "media_assets" USING btree ("url");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_pathname_unique" ON "media_assets" USING btree ("pathname");--> statement-breakpoint
CREATE INDEX "media_assets_uploader_id_index" ON "media_assets" USING btree ("uploader_id");--> statement-breakpoint
CREATE INDEX "media_assets_kind_created_at_index" ON "media_assets" USING btree ("kind","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_status_published_at_index" ON "products" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "products_author_id_index" ON "products" USING btree ("author_id");