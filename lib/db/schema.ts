import {
  bigint,
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
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
export const commentStatus = pgEnum("comment_status", [
  "pending",
  "approved",
  "rejected",
]);
export const otpPurpose = pgEnum("otp_purpose", ["login", "register"]);
export const studentInformationStatus = pgEnum("student_information_status", [
  "draft",
  "pending",
  "approved",
  "rejected",
]);
export const studentAllergyStatus = pgEnum("student_allergy_status", [
  "none",
  "has_allergy",
]);
export const studentDocumentKind = pgEnum("student_document_kind", [
  "national_card",
  "education_certificate",
]);
export const termStatus = pgEnum("term_status", [
  "draft",
  "enrollment_open",
  "active",
  "completed",
  "cancelled",
]);
export const termDeliveryMode = pgEnum("term_delivery_mode", [
  "in_person",
  "online",
  "hybrid",
]);
export const termEnrollmentStatus = pgEnum("term_enrollment_status", [
  "active",
  "withdrawn",
  "completed",
]);
export const termEnrollmentSource = pgEnum("term_enrollment_source", [
  "direct",
  "invitation",
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
    mobile: varchar("mobile", { length: 64 }).notNull(),
    email: varchar("email", { length: 320 }),
    firstNameFa: varchar("first_name_fa", { length: 80 }).notNull(),
    lastNameFa: varchar("last_name_fa", { length: 80 }).notNull(),
    firstNameEn: varchar("first_name_en", { length: 80 }).notNull(),
    lastNameEn: varchar("last_name_en", { length: 80 }).notNull(),
    passwordHash: text("password_hash"),
    passwordFailedAttempts: integer("password_failed_attempts").default(0).notNull(),
    passwordLockedUntil: timestamp("password_locked_until", { withTimezone: true }),
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
  (table) => [
    uniqueIndex("users_mobile_unique").on(table.mobile),
    uniqueIndex("users_email_unique").on(table.email),
  ],
);

export const otpChallenges = pgTable(
  "otp_challenges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mobile: varchar("mobile", { length: 11 }).notNull(),
    purpose: otpPurpose("purpose").notNull(),
    codeHash: varchar("code_hash", { length: 64 }).notNull(),
    attempts: integer("attempts").default(0).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("otp_challenges_mobile_purpose_created_index").on(
      table.mobile,
      table.purpose,
      table.createdAt,
    ),
    index("otp_challenges_expires_at_index").on(table.expiresAt),
  ],
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

export const studentInformation = pgTable(
  "student_information",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    username: varchar("username", { length: 32 }).notNull(),
    nationalCode: varchar("national_code", { length: 10 }),
    birthDate: date("birth_date").notNull(),
    educationLevelFa: varchar("education_level_fa", { length: 120 }).notNull(),
    educationLevelEn: varchar("education_level_en", { length: 120 }),
    fatherNameFa: varchar("father_name_fa", { length: 160 }).notNull(),
    fatherNameEn: varchar("father_name_en", { length: 160 }),
    motherNameFa: varchar("mother_name_fa", { length: 160 }).notNull(),
    motherNameEn: varchar("mother_name_en", { length: 160 }),
    fatherOccupationFa: varchar("father_occupation_fa", { length: 180 }).notNull(),
    fatherOccupationEn: varchar("father_occupation_en", { length: 180 }),
    motherOccupationFa: varchar("mother_occupation_fa", { length: 180 }).notNull(),
    motherOccupationEn: varchar("mother_occupation_en", { length: 180 }),
    allergyStatus: studentAllergyStatus("allergy_status").notNull(),
    allergyDescriptionFa: varchar("allergy_description_fa", { length: 500 }),
    allergyDescriptionEn: varchar("allergy_description_en", { length: 500 }),
    interestLevel: integer("interest_level").notNull(),
    focusLevel: integer("focus_level").notNull(),
    status: studentInformationStatus("status").default("draft").notNull(),
    rejectionReason: text("rejection_reason"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedById: uuid("reviewed_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("student_information_user_unique").on(table.userId),
    uniqueIndex("student_information_username_unique").on(table.username),
    uniqueIndex("student_information_national_code_unique").on(table.nationalCode),
    index("student_information_status_submitted_index").on(
      table.status,
      table.submittedAt,
    ),
    index("student_information_reviewer_index").on(table.reviewedById),
    check(
      "student_information_interest_level_check",
      sql`${table.interestLevel} between 1 and 100`,
    ),
    check(
      "student_information_focus_level_check",
      sql`${table.focusLevel} between 1 and 100`,
    ),
    check(
      "student_information_allergy_description_check",
      sql`${table.allergyStatus} = 'none' or nullif(btrim(${table.allergyDescriptionFa}), '') is not null`,
    ),
  ],
);

export const studentDocuments = pgTable(
  "student_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: studentDocumentKind("kind").notNull(),
    pathname: text("pathname").notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("student_documents_user_kind_unique").on(table.userId, table.kind),
    uniqueIndex("student_documents_pathname_unique").on(table.pathname),
    index("student_documents_user_index").on(table.userId),
  ],
);

export const teacherProfiles = pgTable(
  "teacher_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    username: varchar("username", { length: 32 }).notNull(),
    nationalCode: varchar("national_code", { length: 10 }).notNull(),
    cityFa: varchar("city_fa", { length: 120 }).notNull(),
    cityEn: varchar("city_en", { length: 120 }),
    biographyFa: text("biography_fa").notNull(),
    biographyEn: text("biography_en"),
    aboutFa: text("about_fa").notNull(),
    aboutEn: text("about_en"),
    achievementsFa: text("achievements_fa"),
    achievementsEn: text("achievements_en"),
    memberSince: date("member_since").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("teacher_profiles_user_unique").on(table.userId),
    uniqueIndex("teacher_profiles_username_unique").on(table.username),
    uniqueIndex("teacher_profiles_national_code_unique").on(table.nationalCode),
    index("teacher_profiles_public_updated_index").on(
      table.isPublic,
      table.updatedAt,
    ),
  ],
);

export const teacherSkills = pgTable(
  "teacher_skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherProfileId: uuid("teacher_profile_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    nameFa: varchar("name_fa", { length: 120 }).notNull(),
    nameEn: varchar("name_en", { length: 120 }),
    score: integer("score").notNull(),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [
    uniqueIndex("teacher_skills_profile_sort_unique").on(
      table.teacherProfileId,
      table.sortOrder,
    ),
    index("teacher_skills_profile_index").on(table.teacherProfileId),
    check("teacher_skills_score_check", sql`${table.score} between 0 and 100`),
    check("teacher_skills_sort_order_check", sql`${table.sortOrder} > 0`),
  ],
);

export const teacherWorkExperiences = pgTable(
  "teacher_work_experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherProfileId: uuid("teacher_profile_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    companyFa: varchar("company_fa", { length: 180 }).notNull(),
    companyEn: varchar("company_en", { length: 180 }),
    positionFa: varchar("position_fa", { length: 180 }).notNull(),
    positionEn: varchar("position_en", { length: 180 }),
    periodFa: varchar("period_fa", { length: 120 }).notNull(),
    periodEn: varchar("period_en", { length: 120 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [
    uniqueIndex("teacher_work_experiences_profile_sort_unique").on(
      table.teacherProfileId,
      table.sortOrder,
    ),
    index("teacher_work_experiences_profile_index").on(table.teacherProfileId),
    check("teacher_work_experiences_sort_order_check", sql`${table.sortOrder} > 0`),
  ],
);

export const teacherEducations = pgTable(
  "teacher_educations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherProfileId: uuid("teacher_profile_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    institutionFa: varchar("institution_fa", { length: 180 }).notNull(),
    institutionEn: varchar("institution_en", { length: 180 }),
    degreeFa: varchar("degree_fa", { length: 160 }).notNull(),
    degreeEn: varchar("degree_en", { length: 160 }),
    fieldFa: varchar("field_fa", { length: 180 }).notNull(),
    fieldEn: varchar("field_en", { length: 180 }),
    periodFa: varchar("period_fa", { length: 120 }).notNull(),
    periodEn: varchar("period_en", { length: 120 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [
    uniqueIndex("teacher_educations_profile_sort_unique").on(
      table.teacherProfileId,
      table.sortOrder,
    ),
    index("teacher_educations_profile_index").on(table.teacherProfileId),
    check("teacher_educations_sort_order_check", sql`${table.sortOrder} > 0`),
  ],
);

export const termLevels = pgTable(
  "term_levels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    titleFa: varchar("title_fa", { length: 160 }).notNull(),
    titleEn: varchar("title_en", { length: 160 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("term_levels_title_fa_unique").on(table.titleFa),
    uniqueIndex("term_levels_sort_order_unique").on(table.sortOrder),
    check("term_levels_sort_order_check", sql`${table.sortOrder} > 0`),
  ],
);

export const terms = pgTable(
  "terms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    titleFa: varchar("title_fa", { length: 240 }).notNull(),
    titleEn: varchar("title_en", { length: 240 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    levelId: uuid("level_id")
      .notNull()
      .references(() => termLevels.id, { onDelete: "restrict" }),
    status: termStatus("status").default("draft").notNull(),
    deliveryMode: termDeliveryMode("delivery_mode").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    capacity: integer("capacity"),
    tuitionToman: bigint("tuition_toman", { mode: "number" }).default(0).notNull(),
    locationFa: varchar("location_fa", { length: 500 }),
    locationEn: varchar("location_en", { length: 500 }),
    meetingUrl: text("meeting_url"),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("terms_level_status_dates_index").on(table.levelId, table.status, table.startDate, table.endDate),
    index("terms_status_dates_index").on(table.status, table.startDate, table.endDate),
    index("terms_creator_id_index").on(table.creatorId),
    check("terms_date_range_check", sql`${table.endDate} >= ${table.startDate}`),
    check("terms_capacity_check", sql`${table.capacity} is null or ${table.capacity} > 0`),
    check("terms_tuition_check", sql`${table.tuitionToman} >= 0`),
    check(
      "terms_delivery_details_check",
      sql`(
        (${table.deliveryMode} = 'in_person' and nullif(btrim(${table.locationFa}), '') is not null)
        or (${table.deliveryMode} = 'online' and nullif(btrim(${table.meetingUrl}), '') is not null)
        or (${table.deliveryMode} = 'hybrid' and nullif(btrim(${table.locationFa}), '') is not null and nullif(btrim(${table.meetingUrl}), '') is not null)
      )`,
    ),
  ],
);

export const termPrerequisites = pgTable(
  "term_prerequisites",
  {
    termId: uuid("term_id").notNull().references(() => terms.id, { onDelete: "cascade" }),
    prerequisiteTermId: uuid("prerequisite_term_id").notNull().references(() => terms.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("term_prerequisites_unique").on(table.termId, table.prerequisiteTermId),
    index("term_prerequisites_prerequisite_index").on(table.prerequisiteTermId),
    check("term_prerequisites_not_self_check", sql`${table.termId} <> ${table.prerequisiteTermId}`),
  ],
);

export const termTeachers = pgTable(
  "term_teachers",
  {
    termId: uuid("term_id").notNull().references(() => terms.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    assignedById: uuid("assigned_by_id").references(() => users.id, { onDelete: "set null" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("term_teachers_unique").on(table.termId, table.teacherId),
    index("term_teachers_teacher_index").on(table.teacherId),
  ],
);

export const termSchedules = pgTable(
  "term_schedules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    termId: uuid("term_id").notNull().references(() => terms.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    startTime: time("start_time", { withTimezone: false }).notNull(),
    endTime: time("end_time", { withTimezone: false }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("term_schedules_term_slot_unique").on(table.termId, table.dayOfWeek, table.startTime),
    index("term_schedules_term_day_index").on(table.termId, table.dayOfWeek, table.startTime),
    check("term_schedules_day_check", sql`${table.dayOfWeek} between 0 and 6`),
    check("term_schedules_time_check", sql`${table.endTime} > ${table.startTime}`),
  ],
);

export const termEnrollments = pgTable(
  "term_enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    termId: uuid("term_id").notNull().references(() => terms.id, { onDelete: "cascade" }),
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: termEnrollmentStatus("status").default("active").notNull(),
    source: termEnrollmentSource("source").notNull(),
    enrolledById: uuid("enrolled_by_id").references(() => users.id, { onDelete: "set null" }),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("term_enrollments_term_student_unique").on(table.termId, table.studentId),
    index("term_enrollments_student_status_index").on(table.studentId, table.status),
    index("term_enrollments_term_status_index").on(table.termId, table.status),
  ],
);

export const termInvitations = pgTable(
  "term_invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    termId: uuid("term_id").notNull().references(() => terms.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    maxUses: integer("max_uses"),
    useCount: integer("use_count").default(0).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("term_invitations_token_hash_unique").on(table.tokenHash),
    index("term_invitations_term_created_index").on(table.termId, table.createdAt),
    index("term_invitations_expiry_index").on(table.expiresAt),
    check("term_invitations_max_uses_check", sql`${table.maxUses} is null or ${table.maxUses} > 0`),
    check("term_invitations_use_count_check", sql`${table.useCount} >= 0`),
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

export const honors = pgTable(
  "honors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    titleFa: varchar("title_fa", { length: 240 }).notNull(),
    titleEn: varchar("title_en", { length: 240 }),
    descriptionFa: text("description_fa").notNull(),
    descriptionEn: text("description_en"),
    organizationFa: varchar("organization_fa", { length: 200 }).notNull(),
    organizationEn: varchar("organization_en", { length: 200 }),
    locationFa: varchar("location_fa", { length: 160 }).notNull(),
    locationEn: varchar("location_en", { length: 160 }),
    categoriesFa: text("categories_fa")
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    categoriesEn: text("categories_en")
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    certificateImageUrl: text("certificate_image_url").notNull(),
    issuedAt: date("issued_at").notNull(),
    status: postStatus("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
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
    uniqueIndex("honors_slug_unique").on(table.slug),
    index("honors_status_issued_at_index").on(table.status, table.issuedAt),
    index("honors_creator_id_index").on(table.creatorId),
    check(
      "honors_categories_fa_not_empty_check",
      sql`cardinality(${table.categoriesFa}) > 0`,
    ),
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

export const productCategories = pgTable(
  "product_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    titleFa: varchar("title_fa", { length: 160 }).notNull(),
    titleEn: varchar("title_en", { length: 160 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("product_categories_slug_unique").on(table.slug)],
);

export const productCategoryAssignments = pgTable(
  "product_category_assignments",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => productCategories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_category_assignments_unique").on(
      table.productId,
      table.categoryId,
    ),
    index("product_category_assignments_category_index").on(table.categoryId),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 120 }).notNull(),
    titleFa: varchar("title_fa", { length: 180 }).notNull(),
    titleEn: varchar("title_en", { length: 180 }),
    price: bigint("price", { mode: "number" }),
    inventory: integer("inventory").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_variants_sku_unique").on(table.sku),
    uniqueIndex("product_variants_product_sort_unique").on(
      table.productId,
      table.sortOrder,
    ),
    index("product_variants_product_index").on(table.productId),
    check(
      "product_variants_price_check",
      sql`${table.price} is null or ${table.price} >= 0`,
    ),
    check("product_variants_inventory_check", sql`${table.inventory} >= 0`),
    check("product_variants_sort_order_check", sql`${table.sortOrder} > 0`),
  ],
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "cascade",
    }),
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    authorNameFa: varchar("author_name_fa", { length: 180 }).notNull(),
    authorNameEn: varchar("author_name_en", { length: 180 }).notNull(),
    body: text("body").notNull(),
    status: commentStatus("status").default("pending").notNull(),
    moderatedById: uuid("moderated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "comments_exactly_one_target_check",
      sql`((${table.postId} is not null)::int + (${table.productId} is not null)::int) = 1`,
    ),
    index("comments_post_status_created_index").on(
      table.postId,
      table.status,
      table.createdAt,
    ),
    index("comments_product_status_created_index").on(
      table.productId,
      table.status,
      table.createdAt,
    ),
    index("comments_author_index").on(table.authorId),
  ],
);

export const siteContent = pgTable("site_content", {
  key: varchar("key", { length: 80 }).primaryKey(),
  contactNumber: varchar("contact_number", { length: 80 }),
  email: varchar("email", { length: 320 }),
  addressFa: text("address_fa"),
  addressEn: text("address_en"),
  aboutUsFa: text("about_us_fa").notNull(),
  aboutUsEn: text("about_us_en"),
  missionFa: text("mission_fa").notNull(),
  missionEn: text("mission_en"),
  visionFa: text("vision_fa").notNull(),
  visionEn: text("vision_en"),
  footerTextFa: varchar("footer_text_fa", { length: 500 }).notNull(),
  footerTextEn: varchar("footer_text_en", { length: 500 }),
  updatedById: uuid("updated_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

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
export type OtpPurpose = (typeof otpPurpose.enumValues)[number];
export type StudentInformationStatus = (typeof studentInformationStatus.enumValues)[number];
export type StudentAllergyStatus = (typeof studentAllergyStatus.enumValues)[number];
export type StudentDocumentKind = (typeof studentDocumentKind.enumValues)[number];
export type TeacherProfile = typeof teacherProfiles.$inferSelect;
export type TeacherSkill = typeof teacherSkills.$inferSelect;
export type TeacherWorkExperience = typeof teacherWorkExperiences.$inferSelect;
export type TeacherEducation = typeof teacherEducations.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Honor = typeof honors.$inferSelect;
export type Product = typeof products.$inferSelect;
export type MediaKind = (typeof mediaKind.enumValues)[number];
export type Exam = typeof exams.$inferSelect;
export type ExamStatus = (typeof examStatus.enumValues)[number];
export type ExamQuestionType = (typeof examQuestionType.enumValues)[number];
export type CommentStatus = (typeof commentStatus.enumValues)[number];
export type ProductCategory = typeof productCategories.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type Term = typeof terms.$inferSelect;
export type TermLevel = typeof termLevels.$inferSelect;
export type TermStatus = (typeof termStatus.enumValues)[number];
export type TermDeliveryMode = (typeof termDeliveryMode.enumValues)[number];
export type TermEnrollmentStatus = (typeof termEnrollmentStatus.enumValues)[number];
