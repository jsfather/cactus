import Link from "next/link";
import { PanelEmptyState, PanelSurface, getPanelButtonClass } from "@/components/panel/ui";
import { getTehranTodayIso } from "@/lib/date/local";
import type { StudentUpcomingSession } from "@/lib/attendance/queries";
import type { Locale } from "@/lib/i18n/config";
import { normalizeTermTime } from "@/lib/terms/schedule";

export function StudentDailySchedule({ sessions, locale }: { sessions: StudentUpcomingSession[]; locale: Locale }) {
  const isFa = locale === "fa";
  const today = getTehranTodayIso();
  const number = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US");
  const todayCount = sessions.filter((session) => session.sessionDate === today).length;
  const date = new Intl.DateTimeFormat(isFa ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
  return <section aria-labelledby="student-daily-heading" className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h2 id="student-daily-heading" className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{isFa ? "امروز و کلاس‌های بعدی" : "Today and next classes"}</h2><p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{todayCount ? (isFa ? `${number.format(todayCount)} کلاس امروز دارید؛ نزدیک‌ترین جلسات بعدی هم اینجا هستند.` : `You have ${number.format(todayCount)} class${todayCount === 1 ? "" : "es"} today, followed by your next sessions.`) : (isFa ? "امروز کلاسی ندارید؛ نزدیک‌ترین جلسات بعدی را از همین‌جا ببینید." : "You have no class today. Your next sessions are shown here.")}</p></div>
      <Link href="/panel/student/schedule" className={getPanelButtonClass("secondary", "compact")}>{isFa ? "برنامه کامل" : "Full schedule"}</Link>
    </div>
    {sessions.length ? <div className="grid gap-3 md:grid-cols-2">
      {sessions.map((session) => {
        const isToday = session.sessionDate === today;
        const termTitle = locale === "en" ? session.termTitleEn || session.termTitleFa : session.termTitleFa;
        const levelTitle = locale === "en" ? session.levelTitleEn || session.levelTitleFa : session.levelTitleFa;
        const location = locale === "en" ? session.locationEn || session.locationFa : session.locationFa;
        const mode = session.deliveryMode === "online" ? (isFa ? "آنلاین" : "Online") : session.deliveryMode === "hybrid" ? (isFa ? "حضوری و آنلاین" : "Hybrid") : (isFa ? "حضوری" : "In person");
        return <PanelSurface key={session.id} className={`p-5 ${isToday ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20" : ""}`}>
          <div className="flex items-start justify-between gap-3"><div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${isToday ? "bg-emerald-700 text-white dark:bg-emerald-500 dark:text-emerald-950" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>{isToday ? (isFa ? "امروز" : "Today") : (isFa ? "جلسه بعدی" : "Upcoming")}</span><h3 className="mt-3 font-bold text-zinc-950 dark:text-zinc-50">{termTitle}</h3><p className="mt-1 text-xs text-zinc-500">{levelTitle} · {isFa ? `جلسه ${number.format(session.sequence)}` : `Session ${number.format(session.sequence)}`}</p></div><time className="shrink-0 text-end text-xs font-semibold text-zinc-600 dark:text-zinc-300" dateTime={session.sessionDate}>{date.format(new Date(`${session.sessionDate}T12:00:00Z`))}</time></div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-white/80 p-3 dark:bg-zinc-900"><span className="block text-zinc-500">{isFa ? "زمان" : "Time"}</span><strong className="nums-en mt-1 block" dir="ltr">{normalizeTermTime(session.startTime)}–{normalizeTermTime(session.endTime)}</strong></div><div className="rounded-xl bg-white/80 p-3 dark:bg-zinc-900"><span className="block text-zinc-500">{isFa ? "نحوه برگزاری" : "Delivery"}</span><strong className="mt-1 block truncate">{mode}{location ? ` · ${location}` : ""}</strong></div></div>
          {isToday && session.meetingUrl && session.deliveryMode !== "in_person" ? <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className={`${getPanelButtonClass("primary", "compact")} mt-4 w-full`}>{isFa ? "ورود به کلاس آنلاین" : "Join online class"}</a> : null}
        </PanelSurface>;
      })}
    </div> : <PanelSurface><PanelEmptyState title={isFa ? "کلاس فعالی در برنامه نیست" : "No active classes scheduled"} description={isFa ? "پس از ثبت‌نام در یک ترم فعال، جلسه‌های شما اینجا نمایش داده می‌شوند." : "Your sessions appear here after you enroll in an active term."} /></PanelSurface>}
  </section>;
}
