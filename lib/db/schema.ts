import {
  bigint,
  boolean,
  check,
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
export const examStatus = pgEnum("exam_status", [
  "draft",
  "published",
  "archived",
]);
export const examQuestionType = pgEnum("exam_question_type", [
  "single_choice",
  "multiple_choice",
  "true_false",
  "short_answer",
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

export const exams = pgTable(
  "exams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    titleFa: varchar("title_fa", { length: 240 }).notNull(),
    titleEn: varchar("title_en", { length: 240 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    instructionsFa: text("instructions_fa"),
    instructionsEn: text("instructions_en"),
    status: examStatus("status").default("draft").notNull(),
    durationMinutes: integer("duration_minutes"),
    passingScore: integer("passing_score").default(60).notNull(),
    shuffleQuestions: boolean("shuffle_questions").default(false).notNull(),
    shuffleOptions: boolean("shuffle_options").default(false).notNull(),
    creatorId: uuid("creator_id")
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
    check(
      "exams_duration_minutes_check",
      sql`${table.durationMinutes} is null or ${table.durationMinutes} between 1 and 600`,
    ),
    check(
      "exams_passing_score_check",
      sql`${table.passingScore} between 0 and 100`,
    ),
    index("exams_status_updated_at_index").on(table.status, table.updatedAt),
    index("exams_creator_id_index").on(table.creatorId),
  ],
);

export const examQuestions = pgTable(
  "exam_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    type: examQuestionType("type").notNull(),
    promptFa: text("prompt_fa").notNull(),
    promptEn: text("prompt_en"),
    explanationFa: text("explanation_fa"),
    explanationEn: text("explanation_en"),
    points: integer("points").default(1).notNull(),
    sortOrder: integer("sort_order").notNull(),
    correctBoolean: boolean("correct_boolean"),
    correctAnswerFa: text("correct_answer_fa"),
    correctAnswerEn: text("correct_answer_en"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("exam_questions_points_check", sql`${table.points} between 1 and 1000`),
    check("exam_questions_sort_order_check", sql`${table.sortOrder} > 0`),
    check(
      "exam_questions_answer_shape_check",
      sql`(
        (${table.type} in ('single_choice', 'multiple_choice') and ${table.correctBoolean} is null and ${table.correctAnswerFa} is null and ${table.correctAnswerEn} is null)
        or (${table.type} = 'true_false' and ${table.correctBoolean} is not null and ${table.correctAnswerFa} is null and ${table.correctAnswerEn} is null)
        or (${table.type} = 'short_answer' and ${table.correctBoolean} is null and nullif(btrim(${table.correctAnswerFa}), '') is not null)
      )`,
    ),
    uniqueIndex("exam_questions_exam_sort_order_unique").on(
      table.examId,
      table.sortOrder,
    ),
    index("exam_questions_exam_id_index").on(table.examId),
  ],
);

export const examQuestionOptions = pgTable(
  "exam_question_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => examQuestions.id, { onDelete: "cascade" }),
    labelFa: text("label_fa").notNull(),
    labelEn: text("label_en"),
    isCorrect: boolean("is_correct").default(false).notNull(),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("exam_question_options_sort_order_check", sql`${table.sortOrder} > 0`),
    uniqueIndex("exam_question_options_question_sort_order_unique").on(
      table.questionId,
      table.sortOrder,
    ),
    index("exam_question_options_question_id_index").on(table.questionId),
  ],
);

export type UserRole = (typeof userRole.enumValues)[number];
export type Post = typeof posts.$inferSelect;
export type Product = typeof products.$inferSelect;
export type MediaKind = (typeof mediaKind.enumValues)[number];
export type Exam = typeof exams.$inferSelect;
export type ExamStatus = (typeof examStatus.enumValues)[number];
export type ExamQuestionType = (typeof examQuestionType.enumValues)[number];
