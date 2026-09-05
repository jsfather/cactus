import { eq, asc } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  appSettings,
  coursePages,
  resources,
  ticketDepartments,
  learningActivities,
  notifications,
  terms,
  termLevels,
  termTeachers,
  termSchedules,
  users,
} from "./schema";
export async function seedWorkflows(db: NodePgDatabase, adminId: string) {
  await db.transaction(async (tx) => {
    const claim = async (key: string) =>
      Boolean(
        (
          await tx
            .insert(appSettings)
            .values({ key: `seed.parity.${key}.v1`, value: "complete" })
            .onConflictDoNothing()
            .returning()
        ).length,
      );
    if (await claim("department"))
      await tx
        .insert(ticketDepartments)
        .values({ titleFa: "پشتیبانی آموزشی", titleEn: "Learning support" });
    for (const kind of ["faqs", "guides", "requirements"] as const) {
      if (!(await claim(kind))) continue;
      const content = {
        faqs: {
          titleFa: "چگونه در یک دوره ثبت‌نام کنم؟",
          titleEn: "How do I enroll in a course?",
          contentFa:
            "<p>پس از تکمیل اطلاعات حساب، از بخش کلاس‌ها و ثبت‌نام یک ترم انتخاب کنید. پیش‌نیازها، ظرفیت و تداخل زمانی پیش از ثبت‌نام بررسی می‌شوند.</p>",
          contentEn:
            "<p>Complete your account information, then choose a term from Classes & enrollment. Prerequisites, capacity, and schedule conflicts are checked before enrollment.</p>",
        },
        guides: {
          titleFa: "شروع کار با پنل کاکتوس",
          titleEn: "Getting started with Cactus",
          contentFa:
            "<p>از منوی پنل به کلاس‌ها، برنامه هفتگی، تکالیف و آزمون‌ها دسترسی دارید. برای کمک، یک تیکت پشتیبانی باز کنید.</p>",
          contentEn:
            "<p>Use the workspace menu to find classes, schedules, homework, and exams. Open a support ticket whenever you need help.</p>",
        },
        requirements: {
          titleFa: "آماده‌سازی برای کلاس رباتیک",
          titleEn: "Preparing for robotics class",
          contentFa:
            "<p>پیش از کلاس، اینترنت، صدا و ابزارهای معرفی‌شده در صفحه دوره را بررسی کنید. برای انتخاب ابزار مناسب می‌توانید با پشتیبانی مشورت کنید.</p>",
          contentEn:
            "<p>Before class, check your internet connection, audio, and the tools listed on your course page. Contact support if you need help choosing equipment.</p>",
        },
      }[kind];
      await tx
        .insert(resources)
        .values({ ...content, kind, status: "published", audience: "all" });
    }
    if (await claim("software-catalog")) {
      const software = [
        ["Arduino IDE", "برنامه‌نویسی", "Programming", "Windows, macOS, Linux", "https://www.arduino.cc/en/software", "https://docs.arduino.cc/software/ide/", "برنامه‌نویسی بردهای آردوینو و کار با حسگرها.", "Program Arduino boards and work with sensors."],
        ["Scratch", "برنامه‌نویسی بصری", "Visual programming", "Windows, macOS, Web", "https://scratch.mit.edu/download", "https://scratch.mit.edu/help", "یادگیری برنامه‌نویسی با ساخت بازی و پویانمایی.", "Learn programming through games and animation."],
        ["Python", "برنامه‌نویسی", "Programming", "Windows, macOS, Linux", "https://www.python.org/downloads/", "https://docs.python.org/3/", "برنامه‌نویسی رباتیک، هوش مصنوعی و پردازش داده.", "Programming for robotics, AI, and data processing."],
        ["ROS 2", "رباتیک", "Robotics", "Linux, Windows", "https://docs.ros.org/", "https://docs.ros.org/", "چارچوب توسعه سامانه‌های رباتیک.", "A framework for building robotics systems."],
        ["Gazebo", "شبیه‌سازی", "Simulation", "Linux, macOS, Windows", "https://gazebosim.org/docs/", "https://gazebosim.org/docs/", "شبیه‌سازی ربات‌ها، محیط و حسگرها.", "Simulate robots, environments, and sensors."],
        ["OpenCV", "بینایی ماشین", "Computer vision", "Windows, macOS, Linux", "https://opencv.org/releases/", "https://docs.opencv.org/", "پردازش تصویر و ویدئو در پروژه‌های رباتیک.", "Image and video processing for robotics projects."],
        ["MATLAB", "محاسبات علمی", "Scientific computing", "Windows, macOS, Linux", "https://www.mathworks.com/products/matlab.html", "https://www.mathworks.com/help/matlab/", "محاسبات، مدل‌سازی و کنترل؛ نیازمند مجوز مناسب.", "Computation, modeling, and control; requires an appropriate license."],
      ];
      for (const [name, categoryFa, categoryEn, platforms, attachmentUrl, documentationUrl, fa, en] of software) await tx.insert(resources).values({kind:"requirements",titleFa:name,titleEn:name,categoryFa,categoryEn,platforms,attachmentUrl,documentationUrl,status:"published",contentFa:`<p>${fa}</p><p>نسخه سازگار با دوره و سیستم‌عامل خود را طبق راهنمای رسمی نصب کنید. پیش‌نیازهای سخت‌افزاری و مراحل نصب در مستندات رسمی آمده‌اند.</p>`,contentEn:`<p>${en}</p><p>Install the version compatible with your course and operating system using the official guide. See the documentation for system requirements and installation steps.</p>`});
    }
    let [term] = await tx
      .select()
      .from(terms)
      .orderBy(asc(terms.createdAt))
      .limit(1);
    if (!term && (await claim("sample-term"))) {
      const [level] = await tx
        .select()
        .from(termLevels)
        .orderBy(asc(termLevels.sortOrder))
        .limit(1);
      if (level) {
        const now = new Date();
        const startDate = now.toISOString().slice(0, 10);
        const endDate = new Date(now.getTime() + 28 * 86400000)
          .toISOString()
          .slice(0, 10);
        [term] = await tx
          .insert(terms)
          .values({
            titleFa: "ترم نمونه رباتیک",
            titleEn: "Sample robotics term",
            levelId: level.id,
            status: "draft",
            deliveryMode: "in_person",
            locationFa: "آموزشگاه کاکتوس",
            locationEn: "Cactus school",
            startDate,
            endDate,
            capacity: 12,
            creatorId: adminId,
          })
          .returning();
        const [teacher] = await tx
          .select()
          .from(users)
          .where(eq(users.role, "teacher"))
          .limit(1);
        if (teacher) {
          await tx
            .insert(termTeachers)
            .values({
              termId: term.id,
              teacherId: teacher.id,
              assignedById: adminId,
            });
          await tx
            .insert(termSchedules)
            .values({
              termId: term.id,
              dayOfWeek: 0,
              startTime: "09:00",
              endTime: "10:00",
            });
        }
      }
    }
    if (await claim("course"))
      await tx
        .insert(coursePages)
        .values({
          slug: "getting-started-with-robotics",
          termId: term?.id ?? null,
          titleFa: "آشنایی با رباتیک",
          titleEn: "Getting started with robotics",
          summaryFa: "یک دوره نمونه برای معرفی مسیر یادگیری رباتیک.",
          summaryEn:
            "A sample course introducing the robotics learning journey.",
          contentFa:
            "<p>این صفحه نمونه را با محتوای دوره خود جایگزین و سپس منتشر کنید.</p>",
          contentEn:
            "<p>Replace this sample with your course content before publishing.</p>",
          topic: "Robotics",
          level: "beginner",
          ageGroup: "8–12",
          duration: "4 sessions",
          status: "draft",
          sections: {
            syllabus: [
              {
                titleFa: "اولین ربات من",
                titleEn: "My first robot",
                itemsFa: "شناخت قطعات\nساخت مدار\nبرنامه‌نویسی حرکت",
                itemsEn:
                  "Meet the components\nBuild a circuit\nProgram movement",
              },
            ],
            faqs: [],
            tools: [],
            testimonials: [],
            blogIds: [],
          },
        });
    if (term) {
      for (const kind of ["homework", "recordings", "reports"] as const) {
        if (!(await claim(kind))) continue;
        const labels = {
          homework: [
            "تکلیف نمونه: طراحی ربات",
            "Sample homework: design a robot",
          ],
          recordings: ["جلسه ضبط‌شده نمونه", "Sample recorded lesson"],
          reports: ["گزارش آموزشی نمونه", "Sample teaching report"],
        }[kind];
        await tx
          .insert(learningActivities)
          .values({
            kind,
            termId: term.id,
            creatorId: adminId,
            titleFa: labels[0],
            titleEn: labels[1],
            contentFa:
              "<p>این پیش‌نویس نمونه را پیش از انتشار ویرایش کنید.</p>",
            contentEn: "<p>Edit this sample draft before publishing it.</p>",
            status: "draft",
          });
      }
    }
    if (await claim("notification"))
      await tx
        .insert(notifications)
        .values({
          userId: adminId,
          titleFa: "گردش‌کارهای جدید آماده‌اند",
          titleEn: "New workflows are ready",
          bodyFa:
            "دوره‌ها، تکالیف، تیکت‌ها و سفارش‌ها را از منوی پنل مدیریت کنید. محتواهای نمونه پیش‌نویس هستند.",
          bodyEn:
            "Manage courses, homework, support, and orders from the workspace menu. Sample course and classroom content are drafts.",
          href: "/panel/admin/courses",
        });
  });
}
