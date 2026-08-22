import path from "node:path";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { asc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { hashPassword } from "@/lib/auth/password";
import {
  appSettings,
  examQuestionOptions,
  examQuestions,
  exams,
  mediaAssets,
  posts,
  products,
  users,
} from "./schema";

const starterBlogSeedKey = "seed.blog.starter.v1";
const starterProductSeedKey = "seed.shop.starter.v1";
const starterMediaSeedKey = "seed.media.starter.v1";
const starterExamSeedKey = "seed.exams.starter.v1";
const starterMediaPathname = "content/starter/cactus-placeholder.png";
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

      const [existingAdmin] = await transaction
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "admin"))
        .orderBy(asc(users.createdAt))
        .limit(1);

      if (existingAdmin) {
        return existingAdmin.id;
      }

      const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
      const password = process.env.ADMIN_PASSWORD || null;

      if (
        (email && (!password || password.length < 8)) ||
        (!email && password)
      ) {
        throw new Error(
          "ADMIN_EMAIL and ADMIN_PASSWORD (minimum 8 characters) must be provided together.",
        );
      }

      if (!email || !password) {
        return null;
      }

      const [existingUser] = await transaction
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        throw new Error(
          "ADMIN_EMAIL already belongs to a non-administrator account.",
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
          await transaction.insert(products).values({
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
        },
        {
          key: "seed.users.student.v1",
          role: "student" as const,
          firstNameFa: "دانش پژوه",
          lastNameFa: "نمونه کاکتوس",
          firstNameEn: "Cactus Demo",
          lastNameEn: "Student",
          email: "student.example@cactus.local",
        },
        {
          key: "seed.users.member.v1",
          role: "member" as const,
          firstNameFa: "عضو",
          lastNameFa: "نمونه کاکتوس",
          firstNameEn: "Cactus Demo",
          lastNameEn: "Member",
          email: "member.example@cactus.local",
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
    }
  } finally {
    await pool.end();
  }
}
