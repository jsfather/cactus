CREATE TABLE "landing_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title_fa" varchar(180) NOT NULL,
	"title_en" varchar(180) DEFAULT '' NOT NULL,
	"summary_fa" text DEFAULT '' NOT NULL,
	"summary_en" text DEFAULT '' NOT NULL,
	"content_fa" text DEFAULT '' NOT NULL,
	"content_en" text DEFAULT '' NOT NULL,
	"after_cta_fa" text DEFAULT '' NOT NULL,
	"after_cta_en" text DEFAULT '' NOT NULL,
	"cover_image_url" text DEFAULT '' NOT NULL,
	"video_url" text DEFAULT '' NOT NULL,
	"cta" jsonb NOT NULL,
	"comments_enabled" boolean DEFAULT true NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "landing_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_exactly_one_target_check";--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "landing_id" uuid;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_landing_id_landing_pages_id_fk" FOREIGN KEY ("landing_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_landing_status_created_index" ON "comments" USING btree ("landing_id","status","created_at");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_exactly_one_target_check" CHECK ((("comments"."post_id" is not null)::int + ("comments"."product_id" is not null)::int + ("comments"."course_id" is not null)::int + ("comments"."landing_id" is not null)::int) = 1);