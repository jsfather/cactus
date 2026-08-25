"use client";

import {
  CalendarDate,
  GregorianCalendar,
  PersianCalendar,
  getDayOfWeek,
  isSameDay,
  isSameMonth,
  parseDate,
  startOfMonth,
  today,
  toCalendar,
} from "@internationalized/date";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n/config";
import { PanelSelect } from "./form-controls";
import { getPanelInputClass, primaryButtonClass, secondaryButtonClass } from "./ui";

type SharedProps = {
  locale: Locale;
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
};

const gregorianCalendar = new GregorianCalendar();
const persianCalendar = new PersianCalendar();

function parseCanonicalDate(value: string, locale: Locale) {
  try {
    return toCalendar(parseDate(value), locale === "fa" ? persianCalendar : gregorianCalendar);
  } catch {
    return null;
  }
}

function canonicalDate(value: CalendarDate) {
  return toCalendar(value, gregorianCalendar).toString();
}

function dateForIntl(value: CalendarDate) {
  return new Date(`${canonicalDate(value)}T12:00:00Z`);
}

function DateIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4.5" width="14" height="12.5" rx="2" /><path strokeLinecap="round" d="M6.5 2.8v3.4m7-3.4v3.4M3 8.2h14" /></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 6v4.3l2.8 1.7" /></svg>;
}

function ArrowIcon({ previous, locale }: { previous: boolean; locale: Locale }) {
  const pointsLeft = locale === "en" ? previous : !previous;
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d={pointsLeft ? "m12.5 4.5-5 5.5 5 5.5" : "m7.5 4.5 5 5.5-5 5.5"} /></svg>;
}

function PickerDialog({
  children,
  label,
  onClose,
}: {
  children: React.ReactNode;
  label: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/55 p-4 backdrop-blur-[2px]" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={label} className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 text-start shadow-2xl dark:border-zinc-700 dark:bg-zinc-950">
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function PanelDatePicker({
  locale,
  value,
  onValueChange,
  name,
  required,
  disabled,
  min,
  max,
  "aria-label": ariaLabel,
}: SharedProps & { min?: string; max?: string }) {
  const isFa = locale === "fa";
  const calendar = isFa ? persianCalendar : gregorianCalendar;
  const selected = parseCanonicalDate(value, locale);
  const current = toCalendar(today("Asia/Tehran"), calendar);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selected ?? current));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const number = useMemo(() => new Intl.NumberFormat(isFa ? "fa-IR" : "en-US", { useGrouping: false }), [isFa]);
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(isFa ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }), [isFa]);
  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(isFa ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory", { month: "long", timeZone: "UTC" }), [isFa]);
  const weekdays = isFa ? ["ش", "ی", "د", "س", "چ", "پ", "ج"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const minDate = min ? parseDate(min) : null;
  const maxDate = max ? parseDate(max) : null;
  const minimumYear = Math.min(minDate ? toCalendar(minDate, calendar).year : current.year - 100, visibleMonth.year);
  const maximumYear = Math.max(maxDate ? toCalendar(maxDate, calendar).year : current.year + 20, visibleMonth.year);
  const years = Array.from({ length: maximumYear - minimumYear + 1 }, (_, index) => maximumYear - index);
  const months = Array.from({ length: calendar.getMonthsInYear(visibleMonth) }, (_, index) => {
    const month = index + 1;
    return { month, label: monthFormatter.format(dateForIntl(new CalendarDate(calendar, visibleMonth.year, month, 1))) };
  });
  const monthStart = startOfMonth(visibleMonth);
  const offset = getDayOfWeek(monthStart, isFa ? "fa-IR" : "en-US", isFa ? "sat" : "sun");
  const gridStart = monthStart.subtract({ days: offset });
  const days = Array.from({ length: 42 }, (_, index) => gridStart.add({ days: index }));

  function close() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }
  function selectDate(day: CalendarDate) {
    onValueChange(canonicalDate(day));
    close();
  }
  function available(day: CalendarDate) {
    const gregorian = toCalendar(day, gregorianCalendar);
    return (!minDate || gregorian.compare(minDate) >= 0) && (!maxDate || gregorian.compare(maxDate) <= 0);
  }

  return <>
    {name ? <input type="hidden" name={name} value={value} /> : null}
    <button
      ref={triggerRef}
      type="button"
      disabled={disabled}
      aria-label={ariaLabel ?? (isFa ? "انتخاب تاریخ" : "Choose date")}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => { setVisibleMonth(startOfMonth(selected ?? current)); setOpen(true); }}
      className={`${getPanelInputClass()} flex min-h-12 cursor-pointer items-center justify-between gap-3 disabled:cursor-not-allowed`}
    >
      <span className={value ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400"}>{selected ? dateFormatter.format(dateForIntl(selected)) : (isFa ? "انتخاب تاریخ" : "Choose date")}</span>
      <DateIcon />
    </button>
    {open ? <PickerDialog label={isFa ? "انتخاب تاریخ" : "Choose date"} onClose={close}>
      <div dir={isFa ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between gap-2">
          <button type="button" data-autofocus onClick={() => setVisibleMonth((month) => month.subtract({ months: 1 }))} aria-label={isFa ? "ماه قبل" : "Previous month"} className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700"><ArrowIcon previous locale={locale} /></button>
          <h2 id={titleId} aria-live="polite" className="sr-only">{monthFormatter.format(dateForIntl(visibleMonth))} {number.format(visibleMonth.year)}</h2>
          <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
            <PanelSelect controlSize="compact" value={visibleMonth.month} onChange={(event) => setVisibleMonth((month) => startOfMonth(month.set({ month: Number(event.target.value) })))} aria-label={isFa ? "ماه" : "Month"}>
              {months.map((item) => <option key={item.month} value={item.month}>{item.label}</option>)}
            </PanelSelect>
            <PanelSelect controlSize="compact" value={visibleMonth.year} onChange={(event) => setVisibleMonth((month) => startOfMonth(month.set({ year: Number(event.target.value) })))} aria-label={isFa ? "سال" : "Year"}>
              {years.map((year) => <option key={year} value={year}>{number.format(year)}</option>)}
            </PanelSelect>
          </div>
          <button type="button" onClick={() => setVisibleMonth((month) => month.add({ months: 1 }))} aria-label={isFa ? "ماه بعد" : "Next month"} className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700"><ArrowIcon previous={false} locale={locale} /></button>
        </div>
        <div role="grid" aria-labelledby={titleId} className="mt-4 grid grid-cols-7 gap-1">
          {weekdays.map((weekday) => <span key={weekday} role="columnheader" className="flex h-8 items-center justify-center text-xs font-medium text-zinc-500">{weekday}</span>)}
          {days.map((day) => {
            const enabled = available(day);
            const chosen = selected ? isSameDay(day, selected) : false;
            const todayDate = isSameDay(day, current);
            return <button key={canonicalDate(day)} type="button" role="gridcell" disabled={!enabled} aria-selected={chosen} aria-current={todayDate ? "date" : undefined} onClick={() => selectDate(day)} className={`flex aspect-square cursor-pointer items-center justify-center rounded-lg text-sm transition disabled:cursor-not-allowed disabled:opacity-30 ${chosen ? "bg-emerald-700 font-bold text-white dark:bg-emerald-500 dark:text-emerald-950" : todayDate ? "border border-emerald-500 font-semibold text-emerald-700 dark:text-emerald-300" : isSameMonth(day, visibleMonth) ? "hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950" : "text-zinc-400 hover:bg-zinc-100 dark:text-zinc-600 dark:hover:bg-zinc-900"}`}>{number.format(day.day)}</button>;
          })}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <button type="button" onClick={() => selectDate(current)} disabled={!available(current)} className={secondaryButtonClass}>{isFa ? "امروز" : "Today"}</button>
          {!required && value ? <button type="button" onClick={() => { onValueChange(""); close(); }} className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400">{isFa ? "پاک‌کردن" : "Clear"}</button> : null}
        </div>
      </div>
    </PickerDialog> : null}
  </>;
}

function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return { hour: 9, minute: 0 };
  return { hour: Math.min(23, Number(match[1])), minute: Math.min(59, Number(match[2])) };
}

export function PanelTimePicker({ locale, value, onValueChange, name, disabled, "aria-label": ariaLabel }: SharedProps) {
  const isFa = locale === "fa";
  const initial = parseTime(value);
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const number = useMemo(() => new Intl.NumberFormat(isFa ? "fa-IR" : "en-US", { minimumIntegerDigits: 2, useGrouping: false }), [isFa]);
  const minuteOptions = useMemo(() => [...new Set([...Array.from({ length: 12 }, (_, index) => index * 5), minute])].sort((a, b) => a - b), [minute]);
  const display = value ? `${number.format(parseTime(value).hour)}:${number.format(parseTime(value).minute)}` : (isFa ? "انتخاب زمان" : "Choose time");
  function close() { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()); }
  function show() { const parsed = parseTime(value); setHour(parsed.hour); setMinute(parsed.minute); setOpen(true); }
  function apply() { onValueChange(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`); close(); }

  return <>
    {name ? <input type="hidden" name={name} value={value} /> : null}
    <button ref={triggerRef} type="button" disabled={disabled} aria-label={ariaLabel ?? (isFa ? "انتخاب زمان" : "Choose time")} aria-haspopup="dialog" aria-expanded={open} onClick={show} className={`${getPanelInputClass()} flex min-h-12 cursor-pointer items-center justify-between gap-3 disabled:cursor-not-allowed`}>
      <span className={value ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400"}>{display}</span><ClockIcon />
    </button>
    {open ? <PickerDialog label={isFa ? "انتخاب زمان" : "Choose time"} onClose={close}>
      <div dir={isFa ? "rtl" : "ltr"}>
        <h2 className="text-lg font-bold">{isFa ? "انتخاب زمان" : "Choose time"}</h2>
        <p className="mt-1 text-sm text-zinc-500">{isFa ? "ساعت و دقیقه را با قالب ۲۴ ساعته انتخاب کنید." : "Choose the hour and minute in 24-hour format."}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-2 block text-sm font-medium">{isFa ? "ساعت" : "Hour"}</span><PanelSelect value={hour} onChange={(event) => setHour(Number(event.target.value))} data-autofocus>{Array.from({ length: 24 }, (_, item) => <option key={item} value={item}>{number.format(item)}</option>)}</PanelSelect></label>
          <label className="block"><span className="mb-2 block text-sm font-medium">{isFa ? "دقیقه" : "Minute"}</span><PanelSelect value={minute} onChange={(event) => setMinute(Number(event.target.value))}>{minuteOptions.map((item) => <option key={item} value={item}>{number.format(item)}</option>)}</PanelSelect></label>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <button type="button" onClick={close} className={secondaryButtonClass}>{isFa ? "انصراف" : "Cancel"}</button>
          <button type="button" onClick={apply} className={primaryButtonClass}>{isFa ? "تأیید زمان" : "Apply time"}</button>
        </div>
      </div>
    </PickerDialog> : null}
  </>;
}
