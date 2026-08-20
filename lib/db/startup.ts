import path from "node:path";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { hashPassword } from "@/lib/auth/password";
import { appSettings, posts, users } from "./schema";

const starterBlogSeedKey = "seed.blog.starter.v1";

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

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
    const password = process.env.ADMIN_PASSWORD || null;

    if (
      (email && (!password || password.length < 12)) ||
      (!email && password)
    ) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) must be provided together.",
      );
    }

    let adminId: string | null = null;

    if (email && password) {
      const [existingUser] = await database
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser && existingUser.role !== "admin") {
        throw new Error(
          "ADMIN_EMAIL already belongs to a non-administrator account.",
        );
      }

      if (existingUser) {
        adminId = existingUser.id;
      } else {
        const [createdAdmin] = await database
          .insert(users)
          .values({
            email,
            name: process.env.ADMIN_NAME?.trim() || "مدیر کاکتوس",
            passwordHash: await hashPassword(password),
            role: "admin",
          })
          .returning({ id: users.id });

        adminId = createdAdmin.id;
      }
    } else {
      const [existingAdmin] = await database
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "admin"))
        .orderBy(asc(users.createdAt))
        .limit(1);

      adminId = existingAdmin?.id ?? null;
    }

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
              "در کاکتوس، یادگیری از پرسیدن یک سؤال شروع می‌شود و با طراحی، ساخت و آزمودن ادامه پیدا می‌کند. این نخستین نوشته وبلاگ ماست؛ به‌زودی تجربه‌های کلاس‌ها، پروژه‌های هنرجویان و راهنماهای آموزشی بیشتری منتشر می‌کنیم.",
            contentEn:
              "At Cactus, learning starts with a question and continues through designing, building, and testing. This is our first blog post; soon we will share classroom stories, student projects, and practical learning guides.",
            status: "published",
            publishedAt,
            authorId: adminId,
          });
        }
      });
    }
  } finally {
    await pool.end();
  }
}
