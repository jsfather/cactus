import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { WeeklySchedule } from "@/components/terms/weekly-schedule";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserTermSchedule } from "@/lib/terms/queries";

export default async function StudentSchedulePage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const [student, locale, query] = await Promise.all([requireRole("student"), getPanelLocale(), searchParams]); const entries = await getUserTermSchedule(student.id, "student"); const isFa = locale === "fa";
  return <PanelPage>{query.toast === "joined" ? <ToastOnMount title={isFa ? "با موفقیت به ترم اضافه شدید." : "You joined the term successfully."} /> : null}<PanelPageHeader eyebrow={isFa ? "مسیر آموزشی من" : "My learning"} title={isFa ? "برنامه هفتگی کلاس‌ها" : "Weekly class schedule"} description={isFa ? "زمان، بازه و اطلاعات ورود همه ترم‌های فعال شما در اینجا نمایش داده می‌شود." : "Times, date ranges, and access details for all your active terms appear here."} /><WeeklySchedule entries={entries} locale={locale} /></PanelPage>;
}
