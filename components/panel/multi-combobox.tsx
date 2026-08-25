"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n/config";
import { SelectChevron } from "@/components/ui/select-chevron";
import { getPanelInputClass, getPanelSelectClass } from "./ui";

export type MultiComboboxOption = { value: string; label: string; description?: string };

function getPopupPosition(trigger: HTMLElement): CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(Math.max(rect.width, 256), window.innerWidth - 32);
  const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16));
  const below = window.innerHeight - rect.bottom;
  const above = rect.top;
  const opensAbove = below < 360 && above > below;
  const availableHeight = Math.max(160, (opensAbove ? above : below) - 24);
  return opensAbove
    ? { bottom: window.innerHeight - rect.top + 8, left, maxHeight: availableHeight, width }
    : { left, maxHeight: availableHeight, top: rect.bottom + 8, width };
}

export function PanelMultiCombobox({
  locale,
  options,
  value,
  onValueChange,
  label,
  placeholder,
  noOptionsText,
}: {
  locale: Locale;
  options: MultiComboboxOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  label: string;
  placeholder?: string;
  noOptionsText?: string;
}) {
  const isFa = locale === "fa";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const selected = options.filter((option) => value.includes(option.value));
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale === "fa" ? "fa-IR" : "en-US");
    if (!normalized) return options;
    return options.filter((option) => `${option.label} ${option.description ?? ""}`.toLocaleLowerCase(locale === "fa" ? "fa-IR" : "en-US").includes(normalized));
  }, [locale, options, query]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => searchRef.current?.focus());
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popupRef.current?.contains(target)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    }
    function reposition() {
      if (triggerRef.current) setPopupStyle(getPopupPosition(triggerRef.current));
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); window.removeEventListener("resize", reposition); window.removeEventListener("scroll", reposition, true); };
  }, [open]);

  function toggle(optionValue: string) {
    onValueChange(value.includes(optionValue) ? value.filter((item) => item !== optionValue) : [...value, optionValue]);
  }

  return <div ref={rootRef} className="relative">
    <button ref={triggerRef} type="button" role="combobox" aria-label={label} aria-haspopup="listbox" aria-controls={listboxId} aria-expanded={open} onClick={() => { if (open) setOpen(false); else { setQuery(""); if (triggerRef.current) setPopupStyle(getPopupPosition(triggerRef.current)); setOpen(true); } }} className={`${getPanelSelectClass()} relative flex min-h-12 items-center text-start`}>
      <span className={selected.length ? "truncate" : "truncate text-zinc-400"}>{selected.length ? (isFa ? `${selected.length.toLocaleString("fa-IR")} مدرس انتخاب شده` : `${selected.length} teacher${selected.length === 1 ? "" : "s"} selected`) : (placeholder ?? (isFa ? "انتخاب مدرس‌ها" : "Choose teachers"))}</span>
      <SelectChevron />
    </button>
    {open && typeof document !== "undefined" ? createPortal(<div ref={popupRef} dir={isFa ? "rtl" : "ltr"} style={popupStyle} className="fixed z-[110] flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950">
      <label className="relative block"><span className="sr-only">{isFa ? "جست‌وجوی مدرس" : "Search teachers"}</span><svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"><circle cx="8.5" cy="8.5" r="5" /><path strokeLinecap="round" d="m12.2 12.2 4 4" /></svg><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isFa ? "نام یا شماره موبایل…" : "Name or mobile…"} className={`${getPanelInputClass("compact")} ps-9`} /></label>
      <div id={listboxId} role="listbox" aria-label={label} aria-multiselectable="true" className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
        {filtered.length ? filtered.map((option) => {
          const checked = value.includes(option.value);
          return <button key={option.value} type="button" role="option" aria-selected={checked} onClick={() => toggle(option.value)} className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 text-start transition ${checked ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}><span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${checked ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-emerald-950" : "border-zinc-300 dark:border-zinc-600"}`}>{checked ? <svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 10 3.5 3.5 7.5-8" /></svg> : null}</span><span className="min-w-0"><span className="block truncate text-sm font-medium">{option.label}</span>{option.description ? <span className="nums-en mt-0.5 block truncate text-xs text-zinc-500" dir="ltr">{option.description}</span> : null}</span></button>;
        }) : <p className="px-3 py-6 text-center text-sm text-zinc-500">{noOptionsText ?? (isFa ? "مدرسی پیدا نشد." : "No teachers found.")}</p>}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-zinc-200 px-1 pt-2 dark:border-zinc-800"><span className="text-xs text-zinc-500">{isFa ? `${value.length.toLocaleString("fa-IR")} انتخاب` : `${value.length} selected`}</span><button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950">{isFa ? "تمام" : "Done"}</button></div>
    </div>, document.body) : null}
    {selected.length ? <div className="mt-2 flex flex-wrap gap-2">{selected.map((option) => <span key={option.value} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-zinc-100 py-1 ps-3 pe-1 text-xs dark:bg-zinc-900"><span className="truncate">{option.label}</span><button type="button" onClick={() => toggle(option.value)} aria-label={`${isFa ? "حذف" : "Remove"} ${option.label}`} className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300">×</button></span>)}</div> : null}
  </div>;
}
