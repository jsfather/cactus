import type { Locale } from "./config";

export const dictionaries = {
  fa: {
    school: "مدرسه رباتیک کاکتوس",
    home: "خانه",
    blog: "وبلاگ",
    panel: "ورود به پنل",
    language: "English",
    heroEyebrow: "یادگیری، ساختن، آینده",
    heroTitle: "جایی برای ساختن ایده‌های بزرگ با ربات‌های کوچک",
    heroDescription:
      "در کاکتوس، کودکان و نوجوانان با تجربه عملی رباتیک، برنامه‌نویسی و حل مسئله یاد می‌گیرند چطور ایده‌هایشان را به حرکت درآورند.",
    heroAction: "آشنایی با کاکتوس",
    blogAction: "مطالعه وبلاگ",
    latestPosts: "تازه‌های کاکتوس",
    latestPostsDescription:
      "خبرها، تجربه‌های آموزشی و ایده‌هایی برای همراهی با نسل سازنده فردا.",
    allPosts: "همه نوشته‌ها",
    emptyPosts: "هنوز نوشته‌ای منتشر نشده است.",
    readMore: "ادامه مطلب",
    whyTitle: "چرا کاکتوس؟",
    whyItems: [
      ["یادگیری پروژه‌محور", "هر مفهوم با ساختن و آزمودن به مهارت تبدیل می‌شود."],
      ["مسیر رشد روشن", "آموزش متناسب با سن، تجربه و علاقه هر دانش‌آموز پیش می‌رود."],
      ["مهارت‌های آینده", "خلاقیت، کار تیمی و تفکر مهندسی در کنار فناوری رشد می‌کنند."],
    ],
    blogTitle: "وبلاگ کاکتوس",
    blogDescription: "یادداشت‌ها، خبرها و تجربه‌های مدرسه رباتیک کاکتوس.",
    backToBlog: "بازگشت به وبلاگ",
    publishedOn: "تاریخ انتشار",
  },
  en: {
    school: "Cactus Robotics School",
    home: "Home",
    blog: "Blog",
    panel: "Panel login",
    language: "فارسی",
    heroEyebrow: "Learn, build, shape the future",
    heroTitle: "A place to build big ideas with small robots",
    heroDescription:
      "At Cactus, children and teenagers learn robotics, programming, and problem-solving by turning their own ideas into working projects.",
    heroAction: "Discover Cactus",
    blogAction: "Read the blog",
    latestPosts: "Latest from Cactus",
    latestPostsDescription:
      "School news, learning experiences, and ideas for raising tomorrow’s makers.",
    allPosts: "All posts",
    emptyPosts: "No posts have been published yet.",
    readMore: "Read more",
    whyTitle: "Why Cactus?",
    whyItems: [
      ["Project-based learning", "Every concept becomes a skill through building and testing."],
      ["A clear learning path", "Learning grows with each student’s age, experience, and interests."],
      ["Future-ready skills", "Creativity, teamwork, and engineering thinking grow alongside technology."],
    ],
    blogTitle: "Cactus Blog",
    blogDescription: "Stories, news, and learning experiences from Cactus Robotics School.",
    backToBlog: "Back to blog",
    publishedOn: "Published",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
