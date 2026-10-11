ALTER TABLE "comments" DROP CONSTRAINT "comments_exactly_one_target_check";--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "course_id" uuid;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "compare_at_price" bigint;--> statement-breakpoint
ALTER TABLE "site_content" ADD COLUMN "presentation" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_course_id_course_pages_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_exactly_one_target_check" CHECK ((("comments"."post_id" is not null)::int + ("comments"."product_id" is not null)::int + ("comments"."course_id" is not null)::int) = 1);