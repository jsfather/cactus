import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
export type PanelNavIcon =
  | "home"
  | "blog"
  | "shop"
  | "categories"
  | "media"
  | "exams"
  | "attendance"
  | "terms"
  | "levels"
  | "schedule"
  | "comments"
  | "about"
  | "users"
  | "profile"
  | "studentInfo"
  | "teacherProfile"
  | "honors";
export type PanelNavItem = { href: string; label: string; icon: PanelNavIcon };
export type PanelNavGroup = {
  id: string;
  label: string;
  icon: PanelNavIcon;
  items: PanelNavItem[];
};
export function getPanelNavigation(role: UserRole, locale: Locale) {
  const fa = locale === "fa",
    item = (
      href: string,
      labelFa: string,
      labelEn: string,
      icon: PanelNavIcon,
    ): PanelNavItem => ({ href, label: fa ? labelFa : labelEn, icon });
  const group = (
    id: string,
    labelFa: string,
    labelEn: string,
    icon: PanelNavIcon,
    items: PanelNavItem[],
  ): PanelNavGroup => ({ id, label: fa ? labelFa : labelEn, icon, items });
  const directLinks = [
    item("/panel/notifications", "اعلان‌های من", "My notifications", "about"),
    ...(role === "admin" ? [item("/panel/admin/access", "عنوان‌ها و سطح دسترسی", "Access profiles", "users"), item("/panel/admin/seo", "سئو و سرچ کنسول", "SEO & Search Console", "about")] : []),
  ];
  const support = group("support", "پشتیبانی", "Support", "comments", [
    item("/panel/tickets", "تیکت‌ها", "Tickets", "comments"),
    ...(role === "admin"
      ? [
          item(
            "/panel/admin/departments",
            "دپارتمان‌ها",
            "Departments",
            "comments",
          ),
          item("/panel/admin/live-chat", "چت آنلاین", "Live chat", "comments"),
          item(
            "/panel/admin/live-chat/settings",
            "تنظیمات چت",
            "Chat settings",
            "about",
          ),
          item(
            "/panel/admin/resources/faqs",
            "پرسش‌های متداول",
            "FAQs",
            "about",
          ),
          item(
            "/panel/admin/resources/guides",
            "مدیریت راهنما",
            "Manage guides",
            "blog",
          ),
        ]
      : role === "teacher"
        ? [
            item(
              "/panel/teacher/live-chat",
              "چت پشتیبانی",
              "Support chat",
              "comments",
            ),
          ]
        : []),
    item("/panel/guides", "راهنمای پنل", "Workspace guides", "blog"),
  ]);
  const commerce = group(
    "commerce",
    "فروشگاه و سفارش‌ها",
    "Commerce & orders",
    "shop",
    [
      item("/panel/orders", "سفارش‌ها و رهگیری", "Orders & tracking", "shop"),
      ...(role === "admin"
        ? [
            item(
              "/panel/admin/products",
              "محصولات و آمار فروش",
              "Products & sales",
              "shop",
            ),
            item(
              "/panel/admin/product-categories",
              "دسته‌بندی محصولات",
              "Product categories",
              "categories",
            ),
          ]
        : []),
    ],
  );
  if (role === "admin")
    return {
      directLinks,
      groups: [
        group("education", "آموزش و کلاس‌ها", "Education & classes", "exams", [
          item(
            "/panel/admin/academic/years",
            "سال‌های تحصیلی",
            "Academic years",
            "levels",
          ),
          item(
            "/panel/admin/academic/semesters",
            "نیمسال‌ها و آرشیو",
            "Semesters & archive",
            "levels",
          ),
          item(
            "/panel/admin/academic/templates",
            "کاتالوگ دوره‌های آموزشی",
            "Course catalog",
            "levels",
          ),
          item(
            "/panel/admin/terms",
            "ارائه کلاس و ثبت‌نام",
            "Class offerings & enrollment",
            "terms",
          ),
          item(
            "/panel/admin/term-levels",
            "سطوح آموزشی",
            "Learning levels",
            "levels",
          ),
          item(
            "/panel/admin/attendance",
            "حضور و نمره‌ها",
            "Attendance & grades",
            "attendance",
          ),
          item(
            "/panel/admin/absences",
            "گزارش غیبت‌ها",
            "Absence reports",
            "attendance",
          ),
          item("/panel/admin/exams", "آزمون‌ها", "Exams", "exams"),
          item(
            "/panel/admin/exam-assignments",
            "تخصیص و نتایج آزمون",
            "Exam assignments & results",
            "exams",
          ),
          item(
            "/panel/admin/courses",
            "صفحه‌های معرفی دوره",
            "Course pages",
            "blog",
          ),
          item("/panel/admin/learning/homework", "تکالیف", "Homework", "blog"),
          item(
            "/panel/admin/learning/recordings",
            "جلسات ضبط‌شده",
            "Recordings",
            "media",
          ),
          item(
            "/panel/admin/learning/reports",
            "گزارش‌های آموزشی",
            "Teaching reports",
            "blog",
          ),
          item(
            "/panel/admin/resources/requirements",
            "نرم‌افزارهای مورد نیاز",
            "Required software",
            "levels",
          ),
        ]),
        group("people", "حساب‌ها و کاربران", "People & accounts", "users", [
          item("/panel/admin/students", "دانش‌پژوهان", "Students", "users"),
          item("/panel/admin/teachers", "مدرسین", "Teachers", "users"),
          item("/panel/admin/members", "اعضای عادی", "Members", "users"),
          item("/panel/admin/admins", "مدیران", "Administrators", "users"),
          item(
            "/panel/admin/notifications",
            "مدیریت اعلان‌ها",
            "Manage notifications",
            "about",
          ),
        ]),
        commerce,
        group("content", "محتوا و رسانه", "Content & media", "blog", [
          item("/panel/admin/blog", "وبلاگ", "Blog", "blog"),
          item("/panel/admin/honors", "افتخارات", "Achievements", "honors"),
          item(
            "/panel/admin/landings",
            "لندینگ‌ساز",
            "Landing builder",
            "blog",
          ),
          item(
            "/panel/admin/media",
            "کتابخانه رسانه",
            "Media library",
            "media",
          ),
          item(
            "/panel/admin/comments",
            "مدیریت دیدگاه‌ها",
            "Comment moderation",
            "comments",
          ),
        ]),
        support,
        group("settings", "تنظیمات سایت", "Site settings", "about", [
          item(
            "/panel/admin/settings",
            "هویت، هدر و فوتر",
            "Identity, header & footer",
            "about",
          ),
          item(
            "/panel/admin/settings/appearance",
            "رنگ‌ها و تایپوگرافی",
            "Colors & typography",
            "about",
          ),
          item(
            "/panel/admin/pages",
            "بخش‌های صفحه اصلی",
            "Homepage sections",
            "about",
          ),
          item(
            "/panel/admin/about",
            "درباره ما و تماس",
            "About & contact",
            "about",
          ),
        ]),
      ],
    };
  const education =
    role === "student"
      ? group("education", "آموزش من", "My learning", "terms", [
          item(
            "/panel/student/terms",
            "کلاس‌ها و ثبت‌نام",
            "Classes & enrollment",
            "terms",
          ),
          item(
            "/panel/student/schedule",
            "برنامه کلاس‌ها",
            "Class schedule",
            "schedule",
          ),
          item(
            "/panel/student/attendance",
            "حضور و نمره‌ها",
            "Attendance & grades",
            "attendance",
          ),
          item("/panel/student/exams", "آزمون‌ها", "Exams", "exams"),
          item(
            "/panel/student/learning/homework",
            "تکالیف",
            "Homework",
            "blog",
          ),
          item(
            "/panel/student/learning/recordings",
            "جلسات ضبط‌شده",
            "Recordings",
            "media",
          ),
          item(
            "/panel/student/previous-courses",
            "آموزش‌های پیش از کاکتوس",
            "Learning before Cactus",
            "levels",
          ),
          item(
            "/panel/student/information",
            "پرونده آموزشی",
            "Student information",
            "studentInfo",
          ),
        ])
      : role === "teacher"
        ? group("education", "تدریس و کلاس‌ها", "Teaching & classes", "terms", [
            item("/panel/teacher/terms", "کلاس‌ها", "Classes", "terms"),
            item(
              "/panel/teacher/schedule",
              "برنامه تدریس",
              "Teaching schedule",
              "schedule",
            ),
            item(
              "/panel/teacher/attendance",
              "حضور و نمره‌ها",
              "Attendance & grades",
              "attendance",
            ),
            item("/panel/teacher/students", "دانش‌پژوهان", "Students", "users"),
            item(
              "/panel/teacher/absences",
              "گزارش غیبت‌ها",
              "Absence reports",
              "attendance",
            ),
            item(
              "/panel/teacher/learning/homework",
              "تکالیف",
              "Homework",
              "blog",
            ),
            item(
              "/panel/teacher/learning/recordings",
              "جلسات ضبط‌شده",
              "Recordings",
              "media",
            ),
            item(
              "/panel/teacher/learning/reports",
              "گزارش‌های آموزشی",
              "Teaching reports",
              "blog",
            ),
            item(
              "/panel/teacher/profile",
              "رزومه مدرس",
              "Teaching profile",
              "teacherProfile",
            ),
          ])
        : null;
  return {
    directLinks,
    groups: [...(education ? [education] : []), commerce, support],
  };
}
