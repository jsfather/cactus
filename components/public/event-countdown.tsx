"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

export function EventCountdown({
  deadline,
  locale,
}: {
  deadline: string;
  locale: Locale;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () =>
      setRemaining(Math.max(0, Date.parse(deadline) - Date.now()));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  if (!Number.isFinite(Date.parse(deadline))) return null;
  const seconds = Math.floor((remaining ?? 0) / 1000);
  const values = [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
  const labels =
    locale === "fa"
      ? ["روز", "ساعت", "دقیقه", "ثانیه"]
      : ["Days", "Hours", "Minutes", "Seconds"];
  return (
    <div
      className="event-clock"
      dir="ltr"
      aria-label={
        locale === "fa" ? "زمان باقی‌مانده تا رویداد" : "Time until the event"
      }
    >
      {values.map((value, index) => (
        <div key={labels[index]}>
          <strong suppressHydrationWarning>
            {remaining === null
              ? "—"
              : value.toLocaleString(locale, { minimumIntegerDigits: 2 })}
          </strong>
          <span dir={locale === "fa" ? "rtl" : "ltr"}>{labels[index]}</span>
        </div>
      ))}
      {remaining === 0 && (
        <p>
          {locale === "fa"
            ? "زمان شمارش معکوس به پایان رسید"
            : "The countdown has ended"}
        </p>
      )}
    </div>
  );
}
