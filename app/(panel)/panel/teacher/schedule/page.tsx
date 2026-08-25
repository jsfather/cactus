import { PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { WeeklySchedule } from "@/components/terms/weekly-schedule";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserTermSchedule } from "@/lib/terms/queries";

export default async function TeacherSchedulePage() {
  const [teacher, locale] = await Promise.all([requireRole("teacher"), getPanelLocale()]); const entries = await getUserTermSchedule(teacher.id, "teacher"); const isFa = locale === "fa";
  return <PanelPage><PanelPageHeader eyebrow={isFa ? "زمان‌بندی شخصی" : "Personal timetable"} title={isFa ? "برنامه هفتگی تدریس" : "Teaching schedule"} description={isFa ? "همه کلاس‌های فعال شما بر اساس روز و ساعت در یک نما قرار گرفته‌اند." : "All your active classes are grouped by weekday and time."} /><WeeklySchedule entries={entries} locale={locale} /></PanelPage>;
}
