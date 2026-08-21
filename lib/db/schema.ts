import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRole = pgEnum("user_role", [
  "admin",
  "teacher",
  "student",
  "member",
]);

export const postStatus = pgEnum("post_status", ["draft", "published"]);
export const productStatus = pgEnum("product_status", ["draft", "published"]);
export const mediaKind = pgEnum("media_kind", [
  "avatar",
  "post",
  "product",
  "content",
]);

export const appSettings = pgTable("app_settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    firstNameFa: varchar("first_name_fa", { length: 80 }).notNull(),
    lastNameFa: varchar("last_name_fa", { length: 80 }).notNull(),
    firstNameEn: varchar("first_name_en", { length: 80 }).notNull(),
    lastNameEn: varchar("last_name_en", { length: 80 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").default("member").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    avatarUrl: text("avatar_url"),
    bioFa: text("bio_fa"),
    bioEn: text("bio_en"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    index("sessions_user_id_index").on(table.userId),
    index("sessions_expires_at_index").on(table.expiresAt),
  ],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    titleFa: varchar("title_fa", { length: 240 }).notNull(),
    titleEn: varchar("title_en", { length: 240 }),
    excerptFa: text("excerpt_fa").notNull(),
    excerptEn: text("excerpt_en"),
    contentFa: text("content_fa").notNull(),
    contentEn: text("content_en"),
    coverImageUrl: text("cover_image_url"),
    tags: text("tags")
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    seoTitleFa: varchar("seo_title_fa", { length: 70 }),
    seoTitleEn: varchar("seo_title_en", { length: 70 }),
    seoDescriptionFa: varchar("seo_description_fa", { length: 170 }),
    seoDescriptionEn: varchar("seo_description_en", { length: 170 }),
    seoImageUrl: text("seo_image_url"),
    canonicalUrl: text("canonical_url"),
    noIndex: boolean("no_index").default(false).notNull(),
    status: postStatus("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("posts_slug_unique").on(table.slug),
    index("posts_status_published_at_index").on(
      table.status,
      table.publishedAt,
    ),
    index("posts_author_id_index").on(table.authorId),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    titleFa: varchar("title_fa", { length: 240 }).notNull(),
    titleEn: varchar("title_en", { length: 240 }),
    summaryFa: text("summary_fa").notNull(),
    summaryEn: text("summary_en"),
    contentFa: text("content_fa").notNull(),
    contentEn: text("content_en"),
    price: bigint("price", { mode: "number" }).notNull(),
    inventory: integer("inventory").default(0).notNull(),
    coverImageUrl: text("cover_image_url"),
    status: productStatus("status").default("draft").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),
    index("products_status_published_at_index").on(
      table.status,
      table.publishedAt,
    ),
    index("products_author_id_index").on(table.authorId),
  ],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    pathname: text("pathname").notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(),
    kind: mediaKind("kind").notNull(),
    altFa: varchar("alt_fa", { length: 240 }),
    altEn: varchar("alt_en", { length: 240 }),
    uploaderId: uuid("uploader_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("media_assets_url_unique").on(table.url),
    uniqueIndex("media_assets_pathname_unique").on(table.pathname),
    index("media_assets_uploader_id_index").on(table.uploaderId),
    index("media_assets_kind_created_at_index").on(table.kind, table.createdAt),
  ],
);

export type UserRole = (typeof userRole.enumValues)[number];
export type Post = typeof posts.$inferSelect;
export type Product = typeof products.$inferSelect;
export type MediaKind = (typeof mediaKind.enumValues)[number];
