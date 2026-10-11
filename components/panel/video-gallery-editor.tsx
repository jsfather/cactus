"use client";

import { useContext, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { FieldError, FormLabel, PanelInput, PanelSelect } from "./form-controls";
import { PanelFormSection, secondaryButtonClass } from "./ui";

import { ActionFormFieldErrors } from "@/components/workflows/action-form";

type Item = { id: number; url: string; frame: string };
export function VideoGalleryEditor({ locale, name, title, urls, frames }: { locale: Locale; name: string; title: string; urls: string; frames: string }) {
  const fa = locale === "fa";
  const errors = useContext(ActionFormFieldErrors);
  const [items, setItems] = useState<Item[]>(() => urls.split("\n").filter(Boolean).map((url, i) => ({ id: i, url, frame: frames.split("\n")[i] || "auto" })));
  const [nextId, setNextId] = useState(items.length);
  function move(index: number, offset: number) {
    setItems(current => { const next = [...current]; [next[index], next[index + offset]] = [next[index + offset], next[index]]; return next; });
  }
  return <PanelFormSection title={title}>
    <input type="hidden" name={name} value={items.map(item => item.url).join("\n")} />
    <input type="hidden" name={name === "aboutVideos" ? "aboutVideoFrames" : "testimonialVideoFrames"} value={items.length ? items.map(item => item.frame).join("\n") : "auto"} />
    <p className="mb-4 text-sm text-zinc-500">{fa ? "ویدیوی عمودی دو جایگاه را پر می‌کند؛ دو ویدیوی افقی کنار آن قرار می‌گیرند. ترتیب جایگاه‌ها را با دکمه‌های بالا و پایین تغییر دهید. پخش خودکار بی‌صداست." : "Portrait videos occupy two slots, with landscape videos beside them. Move videos up or down to choose their positions. Autoplay is muted."}</p>
    <div className="space-y-4">{items.map((item, i) => <div key={item.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="mb-3 text-sm font-bold">{fa ? "جایگاه" : "Position"} {(i + 1).toLocaleString(locale)}</p>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <FormLabel label={fa ? "لینک مستقیم ویدیو" : "Direct video URL"}><PanelInput dir="ltr" type="url" required value={item.url} onChange={e => { const url = e.target.value; setItems(current => current.map(row => row.id === item.id ? { ...row, url } : row)); }} /></FormLabel>
        <FormLabel label={fa ? "قاب ویدیو" : "Video frame"}><PanelSelect value={item.frame} onChange={e => { const frame = e.target.value; setItems(current => current.map(row => row.id === item.id ? { ...row, frame } : row)); }}>{[["auto", "خودکار", "Automatic"], ["portrait", "عمودی", "Portrait"], ["landscape", "افقی", "Landscape"], ["square", "مربع", "Square"]].map(([value, labelFa, labelEn]) => <option key={value} value={value}>{fa ? labelFa : labelEn}</option>)}</PanelSelect></FormLabel>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={secondaryButtonClass} disabled={i === 0} aria-label={`${fa ? "انتقال به بالا" : "Move up"}: ${(i + 1).toLocaleString(locale)}`} onClick={() => move(i, -1)}>↑ {fa ? "بالا" : "Up"}</button>
        <button type="button" className={secondaryButtonClass} disabled={i === items.length - 1} aria-label={`${fa ? "انتقال به پایین" : "Move down"}: ${(i + 1).toLocaleString(locale)}`} onClick={() => move(i, 1)}>↓ {fa ? "پایین" : "Down"}</button>
        <button type="button" className={secondaryButtonClass} onClick={() => setItems(current => current.filter(row => row.id !== item.id))}>{fa ? "حذف از چیدمان" : "Remove from layout"}</button>
      </div>
    </div>)}</div>
    <FieldError errors={errors?.[name]} /><FieldError errors={errors?.[name === "aboutVideos" ? "aboutVideoFrames" : "testimonialVideoFrames"]} />
    <button type="button" className={`${secondaryButtonClass} mt-4`} disabled={items.length >= 12} onClick={() => { setItems(current => [...current, { id: nextId, url: "", frame: "auto" }]); setNextId(nextId + 1); }}>{fa ? "افزودن ویدیو" : "Add video"}</button>
  </PanelFormSection>;
}
