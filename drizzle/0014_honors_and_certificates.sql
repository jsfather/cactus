CREATE TABLE "honors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title_fa" varchar(240) NOT NULL,
	"title_en" varchar(240),
	"description_fa" text NOT NULL,
	"description_en" text,
	"organization_fa" varchar(200) NOT NULL,
	"organization_en" varchar(200),
	"location_fa" varchar(160) NOT NULL,
	"location_en" varchar(160),
	"categories_fa" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"categories_en" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"certificate_image_url" text NOT NULL,
	"issued_at" date NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "honors_categories_fa_not_empty_check" CHECK (cardinality("honors"."categories_fa") > 0)
);
--> statement-breakpoint
ALTER TABLE "honors" ADD CONSTRAINT "honors_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "honors_slug_unique" ON "honors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "honors_status_issued_at_index" ON "honors" USING btree ("status","issued_at");--> statement-breakpoint
CREATE INDEX "honors_creator_id_index" ON "honors" USING btree ("creator_id");