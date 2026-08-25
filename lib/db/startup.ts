import path from "node:path";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { asc, eq, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { hashPassword } from "@/lib/auth/password";
import { normalizeIranianMobile } from "@/lib/auth/mobile";
import {
  appSettings,
  comments,
  examQuestionOptions,
  examQuestions,
  exams,
  honors,
  mediaAssets,
  posts,
  productCategories,
  productCategoryAssignments,
  products,
  productVariants,
  siteContent,
  teacherEducations,
  teacherProfiles,
  teacherSkills,
  teacherWorkExperiences,
  termLevels,
  users,
} from "./schema";

const starterBlogSeedKey = "seed.blog.starter.v1";
const starterProductSeedKey = "seed.shop.starter.v1";
const starterMediaSeedKey = "seed.media.starter.v1";
const starterExamSeedKey = "seed.exams.starter.v1";
const starterCatalogSeedKey = "seed.catalog.taxonomy-variants.v1";
const starterSiteContentSeedKey = "seed.site-content.about.v1";
const starterCommentSeedKey = "seed.comments.starter.v1";
const starterTeacherProfileSeedKey = "seed.teacher-profile.starter.v1";
const starterHonorSeedKey = "seed.honors.starter.v1";
const starterTermLevelSeedKey = "seed.terms.level.starter.v1";
const starterMediaPathname = "content/starter/cactus-placeholder.png";
const starterHonorMediaPathname = "content/starter/cactus-honor-placeholder.png";
const adminBootstrapLockId = 1128352836;
const starterMediaPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=",
  "base64",
);

function splitName(value: string, fallbackFirst: string, fallbackLast: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length < 2) {
    return { firstName: parts[0] || fallbackFirst, lastName: fallbackLast };
  }

  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to set up PostgreSQL.");
  }

  const pool = new Pool({
    connectionString,
    max: 1,
    ssl:
      process.env.DATABASE_SSL === "require"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  const database = drizzle(pool);

  try {
    await migrate(database, {
      migrationsFolder: path.join(process.cwd(), "drizzle"),
    });

    const adminId = await database.transaction(async (transaction) => {
      // Serialize bootstrap across replicas so only one can observe an admin-free database.
      await transaction.execute(sql`select pg_advisory_xact_lock(${adminBootstrapLockId})`);

      const rawMobile = process.env.ADMIN_MOBILE?.trim() || "";
      const mobile = normalizeIranianMobile(rawMobile);

      const [existingAdmin] = await transaction
        .select({ id: users.id, mobile: users.mobile })
        .from(users)
        .where(eq(users.role, "admin"))
        .orderBy(asc(users.createdAt))
        .limit(1);

      if (existingAdmin) {
        if (existingAdmin.mobile.startsWith("legacy:")) {
          if (process.env.NODE_ENV === "production" && !mobile) {
            throw new Error(
              "ADMIN_MOBILE is required once to migrate the existing administrator to mobile authentication.",
            );
          }

          if (!mobile) return existingAdmin.id;

          await transaction
            .update(users)
            .set({ mobile, updatedAt: new Date() })
            .where(eq(users.id, existingAdmin.id));
        }
        return existingAdmin.id;
      }

      const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
      const password = process.env.ADMIN_PASSWORD || null;

      if ((rawMobile || password) && (!mobile || !password || password.length < 8)) {
        throw new Error(
          "ADMIN_MOBILE and ADMIN_PASSWORD (minimum 8 characters) must be provided together.",
        );
      }

      if (!mobile || !password) {
        return null;
      }

      const [existingUser] = await transaction
        .select({ id: users.id })
        .from(users)
        .where(email ? or(eq(users.mobile, mobile), eq(users.email, email)) : eq(users.mobile, mobile))
        .limit(1);

      if (existingUser) {
        throw new Error(
          "ADMIN_MOBILE or ADMIN_EMAIL already belongs to a non-administrator account.",
        );
      }

      const adminNameFa = splitName(
        process.env.ADMIN_NAME_FA?.trim() || process.env.ADMIN_NAME?.trim() || "همکار کاکتوس",
        "همکار",
        "کاکتوس",
      );
      const adminNameEn = splitName(
        process.env.ADMIN_NAME_EN?.trim() || "Cactus Administrator",
        "Cactus",
        "Administrator",
      );
      const [createdAdmin] = await transaction
        .insert(users)
        .values({
          mobile,
          email,
          firstNameFa: process.env.ADMIN_FIRST_NAME_FA?.trim() || adminNameFa.firstName,
          lastNameFa: process.env.ADMIN_LAST_NAME_FA?.trim() || adminNameFa.lastName,
          firstNameEn: process.env.ADMIN_FIRST_NAME_EN?.trim() || adminNameEn.firstName,
          lastNameEn: process.env.ADMIN_LAST_NAME_EN?.trim() || adminNameEn.lastName,
          passwordHash: await hashPassword(password),
          role: "admin",
        })
        .returning({ id: users.id });

      return createdAdmin.id;
    });

    if (adminId) {
      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterTermLevelSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });
        if (!claimedSeed) return;
        const [existingLevel] = await transaction.select({ id: termLevels.id }).from(termLevels).limit(1);
        if (!existingLevel) {
          await transaction.insert(termLevels).values({
            titleFa: "مقدماتی",
            titleEn: "Foundation",
            descriptionFa: "سطح آغازین برای ترم‌های پایه رباتیک و برنامه‌نویسی.",
            descriptionEn: "An introductory level for foundational robotics and programming terms.",
            sortOrder: 1,
          });
        }
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterBlogSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });

        if (!claimedSeed) {
          return;
        }

        const [existingPost] = await transaction
          .select({ id: posts.id })
          .from(posts)
          .limit(1);

        if (!existingPost) {
          const publishedAt = new Date();

          await transaction.insert(posts).values({
            slug: "welcome-to-cactus",
            titleFa: "به مدرسه رباتیک کاکتوس خوش آمدید",
            titleEn: "Welcome to Cactus Robotics School",
            excerptFa:
              "اینجا کودکان و نوجوانان با ساختن پروژه‌های واقعی، رباتیک و برنامه‌نویسی را یاد می‌گیرند.",
            excerptEn:
              "Children and teenagers learn robotics and programming here by building real projects.",
            contentFa:
              "در کاکتوس، یادگیری از پرسیدن یک سؤال شروع می‌شود و با طراحی، ساخت و آزمودن ادامه پیدا می‌کند. این نخستین نوشته وبلاگ ماست؛ به‌زودی تجربه‌های کلاس‌ها، پروژه‌های دانش پژوهان و راهنماهای آموزشی بیشتری منتشر می‌کنیم.",
            contentEn:
              "At Cactus, learning starts with a question and continues through designing, building, and testing. This is our first blog post; soon we will share classroom stories, student projects, and practical learning guides.",
            status: "published",
            publishedAt,
            authorId: adminId,
          });
        }
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterHonorSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });
        if (!claimedSeed) return;
        const [existingHonor] = await transaction.select({ id: honors.id }).from(honors).limit(1);
        if (existingHonor) return;
        const honorImageUrl = `/media/${starterHonorMediaPathname}`;
        const [existingHonorImage] = await transaction.select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.url, honorImageUrl)).limit(1);
        if (!existingHonorImage) {
          const uploadRoot = path.resolve(process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), ".data", "uploads"));
          const absolutePath = path.join(uploadRoot, ...starterHonorMediaPathname.split("/"));
          await mkdir(path.dirname(absolutePath), { recursive: true });
          await writeFile(absolutePath, starterMediaPng);
          await transaction.insert(mediaAssets).values({
            url: honorImageUrl,
            pathname: starterHonorMediaPathname,
            originalName: "cactus-honor-placeholder.png",
            mimeType: "image/png",
            size: starterMediaPng.byteLength,
            kind: "content",
            uploaderId: adminId,
            altFa: "تصویر نمونه گواهینامه کاکتوس",
            altEn: "Cactus certificate placeholder",
          });
        }
        await transaction.insert(honors).values({
          slug: "cactus-learning-achievement",
          titleFa: "گواهینامه نمونه مسیر یادگیری کاکتوس",
          titleEn: "Cactus Learning Journey Certificate",
          descriptionFa: "این مورد نمونه، ساختار ثبت و نمایش افتخارات و گواهینامه‌های کاکتوس را نشان می‌دهد.",
          descriptionEn: "This starter item demonstrates how Cactus honors and certificates are managed and presented.",
          organizationFa: "مدرسه رباتیک کاکتوس",
          organizationEn: "Cactus Robotics School",
          locationFa: "تهران، ایران",
          locationEn: "Tehran, Iran",
          categoriesFa: ["آموزش", "رباتیک"],
          categoriesEn: ["Education", "Robotics"],
          certificateImageUrl: honorImageUrl,
          issuedAt: "2025-01-01",
          status: "draft",
          creatorId: adminId,
        });
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterCommentSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });
        if (!claimedSeed) return;

        const [post] = await transaction
          .select({ id: posts.id })
          .from(posts)
          .orderBy(asc(posts.createdAt))
          .limit(1);
        const [admin] = await transaction
          .select({
            firstNameFa: users.firstNameFa,
            lastNameFa: users.lastNameFa,
            firstNameEn: users.firstNameEn,
            lastNameEn: users.lastNameEn,
          })
          .from(users)
          .where(eq(users.id, adminId))
          .limit(1);
        if (post && admin) {
          await transaction.insert(comments).values({
            postId: post.id,
            authorId: adminId,
            authorNameFa: `${admin.firstNameFa} ${admin.lastNameFa}`,
            authorNameEn: `${admin.firstNameEn} ${admin.lastNameEn}`,
            body: "به کاکتوس خوش آمدید! پرسش‌ها و تجربه‌های خود را با ما در میان بگذارید.",
            status: "approved",
            moderatedById: adminId,
            moderatedAt: new Date(),
          });
        }
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterCatalogSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });
        if (!claimedSeed) return;

        let [category] = await transaction
          .select({ id: productCategories.id })
          .from(productCategories)
          .limit(1);
        if (!category) {
          [category] = await transaction
            .insert(productCategories)
            .values({
              slug: "robotics-kits",
              titleFa: "کیت‌های رباتیک",
              titleEn: "Robotics Kits",
              descriptionFa: "کیت‌ها و ابزارهای آموزشی برای ساخت پروژه‌های رباتیک.",
              descriptionEn: "Educational kits and tools for building robotics projects.",
            })
            .returning({ id: productCategories.id });
        }

        const [product] = await transaction
          .select({ id: products.id, price: products.price, inventory: products.inventory })
          .from(products)
          .orderBy(asc(products.createdAt))
          .limit(1);
        if (product) {
          await transaction
            .insert(productCategoryAssignments)
            .values({ productId: product.id, categoryId: category.id })
            .onConflictDoNothing();
          const [existingVariant] = await transaction
            .select({ id: productVariants.id })
            .from(productVariants)
            .where(eq(productVariants.productId, product.id))
            .limit(1);
          if (!existingVariant) {
            await transaction.insert(productVariants).values({
              productId: product.id,
              sku: "CACTUS-STARTER-01",
              titleFa: "نسخه استاندارد",
              titleEn: "Standard Edition",
              price: product.price,
              inventory: product.inventory,
              isActive: true,
              sortOrder: 1,
            });
          }
        }
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterSiteContentSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });
        if (!claimedSeed) return;

        await transaction
          .insert(siteContent)
          .values({
            key: "about",
            contactNumber: "+98 21 0000 0000",
            email: "hello@cactus.local",
            addressFa: "تهران، ایران",
            addressEn: "Tehran, Iran",
            aboutUsFa: "<p>کاکتوس یک مدرسه رباتیک پروژه‌محور برای پرورش سازندگان آینده است.</p>",
            aboutUsEn: "<p>Cactus is a project-based robotics school for tomorrow’s makers.</p>",
            missionFa: "<p>ماموریت ما تبدیل کنجکاوی کودکان و نوجوانان به مهارت ساختن و حل مسئله است.</p>",
            missionEn: "<p>Our mission is to turn young people’s curiosity into making and problem-solving skills.</p>",
            visionFa: "<p>چشم‌انداز ما نسلی خلاق، مسئول و توانمند در استفاده از فناوری است.</p>",
            visionEn: "<p>We envision a creative, responsible generation empowered by technology.</p>",
            footerTextFa: "همه حقوق برای مدرسه رباتیک کاکتوس محفوظ است.",
            footerTextEn: "All rights reserved by Cactus Robotics School.",
            updatedById: adminId,
          })
          .onConflictDoNothing();
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterExamSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });

        if (!claimedSeed) return;

        const [existingExam] = await transaction
          .select({ id: exams.id })
          .from(exams)
          .limit(1);

        if (!existingExam) {
          const [exam] = await transaction
            .insert(exams)
            .values({
              titleFa: "آزمون مقدماتی رباتیک",
              titleEn: "Robotics Fundamentals Quiz",
              descriptionFa: "یک آزمون نمونه برای سنجش مفاهیم پایه مدار و رباتیک.",
              descriptionEn: "A starter quiz covering basic circuits and robotics concepts.",
              instructionsFa: "هر سؤال را با دقت بخوانید و بهترین پاسخ را انتخاب کنید.",
              instructionsEn: "Read each question carefully and choose the best answer.",
              status: "draft",
              durationMinutes: 15,
              passingScore: 60,
              shuffleQuestions: true,
              shuffleOptions: true,
              creatorId: adminId,
            })
            .returning({ id: exams.id });

          const [choiceQuestion] = await transaction
            .insert(examQuestions)
            .values({
              examId: exam.id,
              type: "single_choice",
              promptFa: "کدام قطعه جریان الکتریکی را محدود می‌کند؟",
              promptEn: "Which component limits electric current?",
              explanationFa: "مقاومت برای محدود کردن جریان در مدار استفاده می‌شود.",
              explanationEn: "A resistor is used to limit current in a circuit.",
              points: 2,
              sortOrder: 1,
            })
            .returning({ id: examQuestions.id });

          await transaction.insert(examQuestionOptions).values([
            {
              questionId: choiceQuestion.id,
              labelFa: "مقاومت",
              labelEn: "Resistor",
              isCorrect: true,
              sortOrder: 1,
            },
            {
              questionId: choiceQuestion.id,
              labelFa: "موتور",
              labelEn: "Motor",
              isCorrect: false,
              sortOrder: 2,
            },
            {
              questionId: choiceQuestion.id,
              labelFa: "باتری",
              labelEn: "Battery",
              isCorrect: false,
              sortOrder: 3,
            },
          ]);

          await transaction.insert(examQuestions).values({
            examId: exam.id,
            type: "true_false",
            promptFa: "حسگرها به ربات کمک می‌کنند محیط اطراف خود را تشخیص دهد.",
            promptEn: "Sensors help a robot perceive its environment.",
            explanationFa: "حسگرها اطلاعات محیط را به کنترل‌گر ربات می‌رسانند.",
            explanationEn: "Sensors provide environmental input to the robot controller.",
            points: 1,
            sortOrder: 2,
            correctBoolean: true,
          });
        }
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterProductSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });

        if (!claimedSeed) return;

        const [existingProduct] = await transaction
          .select({ id: products.id })
          .from(products)
          .limit(1);

        if (!existingProduct) {
          const [createdProduct] = await transaction.insert(products).values({
            slug: "starter-robotics-kit",
            titleFa: "کیت شروع رباتیک کاکتوس",
            titleEn: "Cactus Starter Robotics Kit",
            summaryFa:
              "یک مجموعه کامل و آموزشی برای ساخت نخستین پروژه‌های رباتیک در خانه یا کلاس.",
            summaryEn:
              "A complete learning kit for building first robotics projects at home or in class.",
            contentFa:
              "<h2>شروعی ساده برای ساختن</h2><p>این کیت قطعات اصلی، راهنمای پروژه‌محور و تمرین‌های گام‌به‌گام مورد نیاز دانش پژوهان تازه‌کار را در یک بسته فراهم می‌کند.</p><ul><li>مناسب کودکان و نوجوانان</li><li>راهنمای فارسی پروژه‌ها</li><li>قابل استفاده در خانه و کلاس</li></ul>",
            contentEn:
              "<h2>An easy way to start building</h2><p>This kit brings together essential parts, a project-based guide, and step-by-step exercises for new makers.</p><ul><li>Designed for young makers</li><li>Project-based instructions</li><li>Useful at home or in class</li></ul>",
            price: 2450000,
            inventory: 12,
            status: "published",
            isFeatured: true,
            publishedAt: new Date(),
            authorId: adminId,
          }).returning({
            id: products.id,
            price: products.price,
            inventory: products.inventory,
          });

          const [category] = await transaction
            .select({ id: productCategories.id })
            .from(productCategories)
            .limit(1);
          if (category) {
            await transaction.insert(productCategoryAssignments).values({
              productId: createdProduct.id,
              categoryId: category.id,
            });
          }
          await transaction.insert(productVariants).values({
            productId: createdProduct.id,
            sku: "CACTUS-STARTER-01",
            titleFa: "نسخه استاندارد",
            titleEn: "Standard Edition",
            price: createdProduct.price,
            inventory: createdProduct.inventory,
            isActive: true,
            sortOrder: 1,
          });
        }
      });

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterMediaSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });

        if (!claimedSeed) return;

        const [existingAsset] = await transaction
          .select({ id: mediaAssets.id })
          .from(mediaAssets)
          .limit(1);

        if (!existingAsset) {
          const uploadRoot = path.resolve(
            process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), ".data", "uploads"),
          );
          const absolutePath = path.join(uploadRoot, ...starterMediaPathname.split("/"));
          await mkdir(path.dirname(absolutePath), { recursive: true });
          await writeFile(absolutePath, starterMediaPng);

          await transaction.insert(mediaAssets).values({
            url: `/media/${starterMediaPathname}`,
            pathname: starterMediaPathname,
            originalName: "cactus-placeholder.png",
            mimeType: "image/png",
            size: starterMediaPng.byteLength,
            kind: "content",
            uploaderId: adminId,
            altFa: "تصویر نمونه کتابخانه کاکتوس",
            altEn: "Cactus media library placeholder",
          });
        }
      });

      const starterAccounts = [
        {
          key: "seed.users.teacher.v1",
          role: "teacher" as const,
          firstNameFa: "مدرس",
          lastNameFa: "نمونه کاکتوس",
          firstNameEn: "Cactus Demo",
          lastNameEn: "Teacher",
          email: "teacher.example@cactus.local",
          mobile: "seed:teacher",
        },
        {
          key: "seed.users.student.v1",
          role: "student" as const,
          firstNameFa: "دانش پژوه",
          lastNameFa: "نمونه کاکتوس",
          firstNameEn: "Cactus Demo",
          lastNameEn: "Student",
          email: "student.example@cactus.local",
          mobile: "seed:student",
        },
        {
          key: "seed.users.member.v1",
          role: "member" as const,
          firstNameFa: "عضو",
          lastNameFa: "نمونه کاکتوس",
          firstNameEn: "Cactus Demo",
          lastNameEn: "Member",
          email: "member.example@cactus.local",
          mobile: "seed:member",
        },
      ];

      for (const starterAccount of starterAccounts) {
        await database.transaction(async (transaction) => {
          const [claimedSeed] = await transaction
            .insert(appSettings)
            .values({ key: starterAccount.key, value: "complete" })
            .onConflictDoNothing()
            .returning({ key: appSettings.key });

          if (!claimedSeed) {
            return;
          }

          const [existingUser] = await transaction
            .select({ id: users.id })
            .from(users)
            .where(eq(users.role, starterAccount.role))
            .limit(1);

          if (!existingUser) {
            await transaction.insert(users).values({
              firstNameFa: starterAccount.firstNameFa,
              lastNameFa: starterAccount.lastNameFa,
              firstNameEn: starterAccount.firstNameEn,
              lastNameEn: starterAccount.lastNameEn,
              mobile: starterAccount.mobile,
              email: starterAccount.email,
              passwordHash: await hashPassword(
                randomBytes(32).toString("base64url"),
              ),
              role: starterAccount.role,
              isActive: false,
            });
          }
        });
      }

      await database.transaction(async (transaction) => {
        const [claimedSeed] = await transaction
          .insert(appSettings)
          .values({ key: starterTeacherProfileSeedKey, value: "complete" })
          .onConflictDoNothing()
          .returning({ key: appSettings.key });
        if (!claimedSeed) return;

        let [demoTeacher] = await transaction
          .select({ id: users.id })
          .from(users)
          .where(or(eq(users.mobile, "seed:teacher"), eq(users.mobile, "seed:teacher-profile")))
          .limit(1);
        if (!demoTeacher) {
          [demoTeacher] = await transaction
            .insert(users)
            .values({
              firstNameFa: "مدرس",
              lastNameFa: "نمونه کاکتوس",
              firstNameEn: "Cactus Demo",
              lastNameEn: "Teacher",
              mobile: "seed:teacher-profile",
              email: "teacher.profile.example@cactus.local",
              passwordHash: await hashPassword(randomBytes(32).toString("base64url")),
              role: "teacher",
              isActive: false,
            })
            .returning({ id: users.id });
        }

        const [profile] = await transaction
          .insert(teacherProfiles)
          .values({
            userId: demoTeacher.id,
            username: "cactus_demo_teacher",
            // Reserved seed value; real profiles can only save validated Iranian IDs.
            nationalCode: "seed-demo1",
            cityFa: "تهران",
            cityEn: "Tehran",
            biographyFa: "<p>مدرس نمونه کاکتوس با تمرکز بر آموزش پروژه‌محور رباتیک و برنامه‌نویسی.</p>",
            biographyEn: "<p>A Cactus demo teacher focused on project-based robotics and programming education.</p>",
            aboutFa: "<p>این پروفایل نمونه، ساختار معرفی مدرس را نشان می‌دهد و پیش از انتشار می‌تواند توسط مدیر ویرایش شود.</p>",
            aboutEn: "<p>This starter profile demonstrates the teacher profile structure and can be edited before publishing.</p>",
            achievementsFa: "<p>طراحی مسیرهای آموزشی عملی برای سازندگان جوان.</p>",
            achievementsEn: "<p>Designed practical learning paths for young makers.</p>",
            memberSince: "2025-01-01",
            isPublic: false,
          })
          .returning({ id: teacherProfiles.id });

        await transaction.insert(teacherSkills).values([
          { teacherProfileId: profile.id, nameFa: "رباتیک", nameEn: "Robotics", score: 90, sortOrder: 1 },
          { teacherProfileId: profile.id, nameFa: "برنامه‌نویسی", nameEn: "Programming", score: 85, sortOrder: 2 },
        ]);
        await transaction.insert(teacherWorkExperiences).values({
          teacherProfileId: profile.id,
          companyFa: "مدرسه رباتیک کاکتوس",
          companyEn: "Cactus Robotics School",
          positionFa: "مدرس رباتیک",
          positionEn: "Robotics Teacher",
          periodFa: "۱۴۰۳ تا امروز",
          periodEn: "2025–Present",
          descriptionFa: "آموزش پروژه‌محور الکترونیک، برنامه‌نویسی و ساخت ربات.",
          descriptionEn: "Project-based teaching in electronics, programming, and robot building.",
          sortOrder: 1,
        });
        await transaction.insert(teacherEducations).values({
          teacherProfileId: profile.id,
          institutionFa: "دانشگاه نمونه",
          institutionEn: "Example University",
          degreeFa: "کارشناسی",
          degreeEn: "Bachelor's degree",
          fieldFa: "مهندسی برق",
          fieldEn: "Electrical Engineering",
          periodFa: "۱۳۹۸ تا ۱۴۰۲",
          periodEn: "2019–2023",
          sortOrder: 1,
        });
      });
    }
  } finally {
    await pool.end();
  }
}
