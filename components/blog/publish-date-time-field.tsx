"use client";

import { useState } from "react";
import { PanelDatePicker, PanelTimePicker } from "@/components/panel/date-time-picker";
import type { Locale } from "@/lib/i18n/config";

function toTehranLocalValue(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function toUtcIso(value: string) {
  if (!value) return "";
  const date = new Date(`${value}:00+03:30`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function PublishDateTimeField({
  initialValue,
  locale,
}: {
  initialValue: string;
  locale: Locale;
}) {
  const [value, setValue] = useState(() => toTehranLocalValue(initialValue));
  const [datePart = "", timePart = ""] = value.split("T");

  return (
    <>
      <input type="hidden" name="publishedAt" value={toUtcIso(value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <PanelDatePicker locale={locale} value={datePart} onValueChange={(date) => setValue(date ? `${date}T${timePart || "09:00"}` : "")} aria-label={locale === "fa" ? "تاریخ انتشار خودکار" : "Automatic publication date"} />
        <PanelTimePicker locale={locale} value={timePart} onValueChange={(time) => setValue(`${datePart}T${time}`)} aria-label={locale === "fa" ? "زمان انتشار خودکار" : "Automatic publication time"} />
      </div>
    </>
  );
}
