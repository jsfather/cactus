import type { Locale } from "@/lib/i18n/config";

/** Calendar presentation is Jalali in both locales; persistence stays ISO. */
export function formatPanelDate(
  value: Date | string,
  locale: Locale,
  withTime = false,
) {
  const date =
    typeof value === "string"
      ? new Date(
          /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value,
        )
      : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    calendar: "persian",
    timeZone: "Asia/Tehran",
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(date);
}
