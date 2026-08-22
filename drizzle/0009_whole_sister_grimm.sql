CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid,
	"product_id" uuid,
	"author_id" uuid,
	"author_name_fa" varchar(180) NOT NULL,
	"author_name_en" varchar(180) NOT NULL,
	"body" text NOT NULL,
	"status" "comment_status" DEFAULT 'pending' NOT NULL,
	"moderated_by_id" uuid,
	"moderated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comments_exactly_one_target_check" CHECK ((("comments"."post_id" is not null)::int + ("comments"."product_id" is not null)::int) = 1)
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title_fa" varchar(160) NOT NULL,
	"title_en" varchar(160),
	"description_fa" text,
	"description_en" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_category_assignments" (
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" varchar(120) NOT NULL,
	"title_fa" varchar(180) NOT NULL,
	"title_en" varchar(180),
	"price" bigint,
	"inventory" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_price_check" CHECK ("product_variants"."price" is null or "product_variants"."price" >= 0),
	CONSTRAINT "product_variants_inventory_check" CHECK ("product_variants"."inventory" >= 0),
	CONSTRAINT "product_variants_sort_order_check" CHECK ("product_variants"."sort_order" > 0)
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"key" varchar(80) PRIMARY KEY NOT NULL,
	"contact_number" varchar(80),
	"email" varchar(320),
	"address_fa" text,
	"address_en" text,
	"about_us_fa" text NOT NULL,
	"about_us_en" text,
	"mission_fa" text NOT NULL,
	"mission_en" text,
	"vision_fa" text NOT NULL,
	"vision_en" text,
	"footer_text_fa" varchar(500) NOT NULL,
	"footer_text_en" varchar(500),
	"updated_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_moderated_by_id_users_id_fk" FOREIGN KEY ("moderated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_category_assignments" ADD CONSTRAINT "product_category_assignments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_category_assignments" ADD CONSTRAINT "product_category_assignments_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_content" ADD CONSTRAINT "site_content_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_post_status_created_index" ON "comments" USING btree ("post_id","status","created_at");--> statement-breakpoint
CREATE INDEX "comments_product_status_created_index" ON "comments" USING btree ("product_id","status","created_at");--> statement-breakpoint
CREATE INDEX "comments_author_index" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_categories_slug_unique" ON "product_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "product_category_assignments_unique" ON "product_category_assignments" USING btree ("product_id","category_id");--> statement-breakpoint
CREATE INDEX "product_category_assignments_category_index" ON "product_category_assignments" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_sku_unique" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_product_sort_unique" ON "product_variants" USING btree ("product_id","sort_order");--> statement-breakpoint
CREATE INDEX "product_variants_product_index" ON "product_variants" USING btree ("product_id");