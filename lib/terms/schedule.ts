import type { Locale } from "@/lib/i18n/config";

export type TermScheduleValue = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export const termWeekDays = [
  { value: 0, fa: "شنبه", en: "Saturday", jsDay: 6 },
  { value: 1, fa: "یکشنبه", en: "Sunday", jsDay: 0 },
  { value: 2, fa: "دوشنبه", en: "Monday", jsDay: 1 },
  { value: 3, fa: "سه‌شنبه", en: "Tuesday", jsDay: 2 },
  { value: 4, fa: "چهارشنبه", en: "Wednesday", jsDay: 3 },
  { value: 5, fa: "پنجشنبه", en: "Thursday", jsDay: 4 },
  { value: 6, fa: "جمعه", en: "Friday", jsDay: 5 },
] as const;

export function getTermDayLabel(dayOfWeek: number, locale: Locale) {
  const day = termWeekDays.find((item) => item.value === dayOfWeek);
  return day ? day[locale] : "";
}

export function normalizeTermTime(value: string) {
  return value.slice(0, 5);
}

export function countScheduledSessions(
  startDate: string,
  endDate: string,
  schedules: Array<TermScheduleValue>,
) {
  return buildTermSessions(startDate, endDate, schedules).length;
}

export type GeneratedTermSession = {
  sessionDate: string;
  startTime: string;
  endTime: string;
  sequence: number;
};

export function buildTermSessions(
  startDate: string,
  endDate: string,
  schedules: Array<TermScheduleValue>,
): GeneratedTermSession[] {
  if (!schedules.length) return [];
  const start = new Date(`${startDate}T12:00:00Z`);
  const end = new Date(`${endDate}T12:00:00Z`);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) return [];

  const generated: Omit<GeneratedTermSession, "sequence">[] = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const matching = schedules
      .filter((schedule) => termWeekDays.find((day) => day.value === schedule.dayOfWeek)?.jsDay === cursor.getUTCDay())
      .sort((first, second) => first.startTime.localeCompare(second.startTime));
    for (const schedule of matching) {
      generated.push({
        sessionDate: cursor.toISOString().slice(0, 10),
        startTime: normalizeTermTime(schedule.startTime),
        endTime: normalizeTermTime(schedule.endTime),
      });
    }
  }
  return generated.map((session, index) => ({ ...session, sequence: index + 1 }));
}

export function schedulesOverlap(
  first: Pick<TermScheduleValue, "dayOfWeek" | "startTime" | "endTime">,
  second: Pick<TermScheduleValue, "dayOfWeek" | "startTime" | "endTime">,
) {
  return first.dayOfWeek === second.dayOfWeek && first.startTime < second.endTime && first.endTime > second.startTime;
}
