import type { TermStatus } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

export function TermStatusBadge({ status, locale }: { status: TermStatus; locale: Locale }) {
  const labels = {
    fa: { draft: "پیش‌نویس", enrollment_open: "ثبت‌نام باز", active: "در حال برگزاری", completed: "تکمیل‌شده", cancelled: "لغوشده" },
    en: { draft: "Draft", enrollment_open: "Enrollment open", active: "Active", completed: "Completed", cancelled: "Cancelled" },
  };
  const styles = {
    draft: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    enrollment_open: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    completed: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{labels[locale][status]}</span>;
}
