import { PanelEmptyState, PanelSurface } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getTermDayLabel, normalizeTermTime, termWeekDays } from "@/lib/terms/schedule";

export type ScheduleEntry = {
  termId: string;
  titleFa: string;
  titleEn: string | null;
  status: string;
  deliveryMode: "in_person" | "online" | "hybrid";
  startDate: string;
  endDate: string;
  locationFa: string | null;
  locationEn: string | null;
  meetingUrl: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export function WeeklySchedule({ entries, locale }: { entries: ScheduleEntry[]; locale: Locale }) {
  const isFa = locale === "fa";
  const date = new Intl.DateTimeFormat(isFa ? "fa-IR" : "en-US", { year: "numeric", month: "short", day: "numeric" });
  if (!entries.length) return <PanelSurface><PanelEmptyState title={isFa ? "برنامه‌ای وجود ندارد" : "No schedule yet"} description={isFa ? "وقتی ترمی به شما اختصاص داده شود، زمان کلاس‌ها اینجا نمایش داده می‌شود." : "Class times appear here when a term is assigned to you."} /></PanelSurface>;
  return <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
    {termWeekDays.map((day) => {
      const dayEntries = entries.filter((entry) => entry.dayOfWeek === day.value);
      if (!dayEntries.length) return null;
      return <section key={day.value} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"><h2 className="font-bold">{getTermDayLabel(day.value, locale)}</h2><p className="mt-1 text-xs text-zinc-500">{isFa ? `${dayEntries.length.toLocaleString("fa-IR")} کلاس` : `${dayEntries.length} class${dayEntries.length === 1 ? "" : "es"}`}</p></header>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">{dayEntries.map((entry) => {
          const title = locale === "en" ? entry.titleEn || entry.titleFa : entry.titleFa;
          const location = locale === "en" ? entry.locationEn || entry.locationFa : entry.locationFa;
          return <article key={`${entry.termId}-${entry.dayOfWeek}-${entry.startTime}`} className="p-5">
            <div className="flex items-center justify-between gap-3"><p className="font-semibold text-zinc-950 dark:text-zinc-50">{title}</p><span className="nums-en shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" dir="ltr">{normalizeTermTime(entry.startTime)}–{normalizeTermTime(entry.endTime)}</span></div>
            <p className="nums-en mt-2 text-xs text-zinc-500" dir="ltr">{date.format(new Date(`${entry.startDate}T12:00:00Z`))} – {date.format(new Date(`${entry.endDate}T12:00:00Z`))}</p>
            {location ? <p className="mt-3 text-xs leading-5 text-zinc-600 dark:text-zinc-400">{location}</p> : null}
            {entry.meetingUrl && entry.deliveryMode !== "in_person" ? <a href={entry.meetingUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-400">{isFa ? "ورود به کلاس آنلاین ↗" : "Open online class ↗"}</a> : null}
          </article>;
        })}</div>
      </section>;
    })}
  </div>;
}
