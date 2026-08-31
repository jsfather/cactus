import Link from "next/link";
import { PanelEmptyState, PanelSurface, getPanelButtonClass } from "@/components/panel/ui";
import { getTehranTodayIso } from "@/lib/date/local";
import type { AttendanceTaskSession } from "@/lib/attendance/queries";
import type { Locale } from "@/lib/i18n/config";
import { normalizeTermTime } from "@/lib/terms/schedule";

export function AttendanceTaskBoard({
  sessions,
  locale,
  role,
  title,
  description,
  emptyTitle,
  emptyDescription,
  showSummary = true,
}: {
  sessions: AttendanceTaskSession[];
  locale: Locale;
  role: "admin" | "teacher";
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  showSummary?: boolean;
}) {
  const isFa = locale === "fa";
  const today = getTehranTodayIso();
  const number = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US");
  const pending = sessions.filter((session) => session.eligibleCount > 0 && session.recordedCount < session.eligibleCount && session.sessionDate <= today).length;
  const completed = sessions.filter((session) => session.eligibleCount > 0 && session.recordedCount >= session.eligibleCount).length;
  const graded = sessions.reduce((total, session) => total + session.gradedCount, 0);

  return <section aria-labelledby="attendance-task-heading" className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="attendance-task-heading" className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      {showSummary ? <div className="flex flex-wrap gap-2 text-xs">
        <SummaryPill tone="amber" value={pending} label={isFa ? "نیازمند اقدام" : "Need action"} locale={locale} />
        <SummaryPill tone="emerald" value={completed} label={isFa ? "تکمیل حضور" : "Attendance done"} locale={locale} />
        <SummaryPill tone="violet" value={graded} label={isFa ? "نمره ثبت‌شده" : "Grades recorded"} locale={locale} />
      </div> : null}
    </div>

    {sessions.length ? <div className="grid gap-3">
      {sessions.map((session) => {
        const isToday = session.sessionDate === today;
        const hasRoster = session.eligibleCount > 0;
        const attendanceComplete = hasRoster && session.recordedCount >= session.eligibleCount;
        const needsAction = hasRoster && !attendanceComplete && session.sessionDate <= today;
        const status = !hasRoster
          ? { label: isFa ? "بدون دانش پژوه" : "No roster", className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" }
          : attendanceComplete
            ? { label: isFa ? "حضور کامل" : "Attendance complete", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" }
            : needsAction
              ? { label: isFa ? "نیازمند ثبت" : "Needs attendance", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" }
              : { label: isFa ? "پیش‌رو" : "Upcoming", className: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300" };
        const termTitle = locale === "en" ? session.termTitleEn || session.termTitleFa : session.termTitleFa;
        const levelTitle = locale === "en" ? session.levelTitleEn || session.levelTitleFa : session.levelTitleFa;
        const date = new Intl.DateTimeFormat(isFa ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
        const progress = hasRoster ? Math.min(100, Math.round((session.recordedCount / session.eligibleCount) * 100)) : 0;
        return <PanelSurface key={session.id} className={`p-4 sm:p-5 ${isToday ? "border-emerald-300 ring-1 ring-emerald-100 dark:border-emerald-800 dark:ring-emerald-950" : ""}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className={`grid w-20 shrink-0 place-items-center rounded-2xl px-2 py-3 text-center ${isToday ? "bg-emerald-700 text-white dark:bg-emerald-500 dark:text-emerald-950" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"}`}>
                <span className="text-[10px] font-bold uppercase tracking-wide">{isToday ? (isFa ? "امروز" : "Today") : date.format(new Date(`${session.sessionDate}T12:00:00Z`)).split(" ")[0]}</span>
                <strong className="mt-1 text-lg">{date.format(new Date(`${session.sessionDate}T12:00:00Z`)).replace(/^\S+\s*/, "")}</strong>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}>{status.label}</span><span className="text-xs text-zinc-500">{isFa ? `جلسه ${number.format(session.sequence)}` : `Session ${number.format(session.sequence)}`}</span></div>
                <h3 className="mt-2 truncate font-bold text-zinc-950 dark:text-zinc-50">{termTitle}</h3>
                <p className="mt-1 text-xs text-zinc-500">{levelTitle} · <span dir="ltr" className="nums-en">{normalizeTermTime(session.startTime)}–{normalizeTermTime(session.endTime)}</span></p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:min-w-72">
              <TaskMetric value={`${number.format(session.recordedCount)}/${number.format(session.eligibleCount)}`} label={isFa ? "حضور" : "Attendance"} />
              <TaskMetric value={number.format(session.absentCount + session.excusedCount)} label={isFa ? "غیبت" : "Absent"} />
              <TaskMetric value={number.format(session.gradedCount)} label={isFa ? "نمره" : "Graded"} />
            </div>
            <div className="flex items-center gap-3 lg:w-44 lg:flex-col lg:items-stretch">
              <div className="min-w-0 flex-1 lg:w-full"><div className="mb-1 flex justify-between text-[10px] text-zinc-500"><span>{isFa ? "پیشرفت" : "Progress"}</span><span>{number.format(progress)}{isFa ? "٪" : "%"}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><div className={`h-full rounded-full ${attendanceComplete ? "bg-emerald-600" : "bg-amber-500"}`} style={{ width: `${progress}%` }} /></div></div>
              <Link href={`/panel/${role}/attendance/${session.id}`} className={`${getPanelButtonClass(needsAction || isToday ? "primary" : "secondary", "compact")} shrink-0 lg:w-full`}>{attendanceComplete ? (isFa ? "بازبینی" : "Review") : (isFa ? "بازکردن دفتر" : "Open register")}</Link>
            </div>
          </div>
        </PanelSurface>;
      })}
    </div> : <PanelSurface><PanelEmptyState title={emptyTitle} description={emptyDescription} /></PanelSurface>}
  </section>;
}

function TaskMetric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl bg-zinc-50 px-2 py-2.5 dark:bg-zinc-900"><strong className="block text-sm text-zinc-950 dark:text-zinc-50">{value}</strong><span className="mt-0.5 block text-[10px] text-zinc-500">{label}</span></div>;
}

function SummaryPill({ tone, value, label, locale }: { tone: "amber" | "emerald" | "violet"; value: number; label: string; locale: Locale }) {
  const styles = { amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300", emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300", violet: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300" };
  return <span className={`rounded-full px-3 py-1.5 font-semibold ${styles[tone]}`}>{value.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} {label}</span>;
}
