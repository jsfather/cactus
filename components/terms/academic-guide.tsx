import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { PanelSurface } from "@/components/panel/ui";

export function AcademicGuide({ locale }: { locale: Locale }) {
  const t = (fa: string, en: string) => locale === "fa" ? fa : en;
  const sections = [
    { href: "/panel/admin/academic/years", title: t("سال تحصیلی", "Academic year"), example: t("مثال: سال تحصیلی ۱۴۰۵–۱۴۰۶", "Example: academic year 1405–1406"), description: t("بازه کلی آموزش است و چند نیمسال را در بر می‌گیرد. برای هر سال جدید، یک سال تحصیلی جدا بسازید.", "The overall teaching period containing multiple semesters. Create a separate academic year for each new year.") },
    { href: "/panel/admin/academic/semesters", title: t("نیمسال", "Semester"), example: t("مثال: پاییز، بهار یا تابستان", "Example: autumn, spring, or summer"), description: t("یک بازه زمانی داخل سال تحصیلی است. چند کلاس می‌توانند در یک نیمسال برگزار شوند؛ تاریخ آن‌ها باید در بازه نیمسال باشد.", "A period within an academic year. Multiple classes can run in one semester; their dates must fit its range.") },
    { href: "/panel/admin/academic/templates", title: t("الگوی دوره", "Course template"), example: t("مثال: رباتیک مقدماتی", "Example: introductory robotics"), description: t("عنوان، توضیحات و سطح ثابت آموزش است. یک‌بار تعریف می‌شود و برای ورودی‌های بعدی دوباره استفاده می‌شود؛ خودش دانش‌پژو یا برنامه زمانی ندارد.", "Reusable course title, description, and level. Define it once for future intakes; the template itself has no roster or schedule.") },
    { href: "/panel/admin/terms", title: t("ارائه دوره / ترم", "Course offering / term"), example: t("مثال: رباتیک مقدماتی، پاییز ۱۴۰۵، گروه الف", "Example: introductory robotics, autumn 1405, group A"), description: t("اجرای واقعی دوره برای یک گروه است؛ مدرس، ظرفیت، شهریه، برنامه جلسات و ثبت‌نام دانش‌پژوها اینجا مشخص می‌شود. در پنل فعلی این بخش «ترم‌ها» نام دارد.", "The actual class for a group, with teachers, capacity, tuition, sessions, and student enrollment. This panel calls these offerings “Terms”.") },
  ];
  return <PanelSurface className="p-5 sm:p-6">
    <details className="group">
      <summary className="cursor-pointer text-start font-semibold text-zinc-900 dark:text-zinc-100">{t("راهنمای سال تحصیلی، نیمسال، دوره و ثبت‌نام", "Guide to academic years, semesters, courses, and enrollment")}</summary>
      <div className="mt-5 space-y-5 text-start">
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((section) => <div key={section.href} className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <Link href={section.href} className="cursor-pointer font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400">{section.title}</Link>
            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{section.description}</p>
            <p className="mt-3 text-xs leading-6 text-zinc-500">{section.example}</p>
          </div>)}
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-7 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200">
          <h3 className="font-semibold">{t("ترتیب پیشنهادی کار", "Recommended workflow")}</h3>
          <ol className="mt-2 list-decimal space-y-2 ps-5">
            <li>{t("سال تحصیلی و نیمسال آن را بسازید؛ سطح و الگوی دوره را هم یک‌بار تعریف کنید.", "Create the academic year and its semester; define the level and reusable course template once.")}</li>
            <li>{t("در «ترم‌ها» یک ارائه جدید بسازید، نیمسال و الگوی دوره را انتخاب کنید و مدرس، شهریه و برنامه را مشخص کنید.", "Create a new offering in Terms, select the semester and template, then set its teachers, tuition, and schedule.")}</li>
            <li>{t("در همان ترم، دانش‌پژو را با جست‌وجو اضافه کنید؛ یا با وضعیت «ثبت‌نام باز» پیوند ثبت‌نام بسازید. حضور و غیاب و نتایج از همین ثبت‌نام‌ها تشکیل می‌شوند.", "Search and add students inside that term, or create an enrollment link when enrollment is open. Attendance and results are linked to these enrollments.")}</li>
            <li>{t("پس از تکمیل نمره‌ها، نیمسال را آرشیو کنید. ثبت‌نام‌های فعال تکمیل و ارائه‌ها قفل می‌شوند؛ سوابق حفظ می‌شوند. برای ورودی بعد، ارائه تازه بسازید و همان الگوی دوره را انتخاب کنید؛ ترم قبلی را بازنویسی نکنید.", "After finalizing grades, archive the semester. Active enrollments are completed and offerings locked, retaining records. For the next intake, create a new offering from the same template rather than overwriting the previous class.")}</li>
          </ol>
        </div>
        <p className="text-xs leading-6 text-zinc-500">{t("«دوره‌های پیش از ورود به کاکتوس» فقط برای سوابق آموزشگاه‌های دیگر است؛ ثبت آن نه ثبت‌نام ترم ایجاد می‌کند، نه پرداخت یا حضور و غیاب، و نه جایگزین تکمیل پیش‌نیازهای ترم است.", "“Courses before joining Cactus” only records external learning. It does not enroll a student, create payments or attendance, or replace completion of term prerequisites.")}</p>
      </div>
    </details>
  </PanelSurface>;
}
