"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelInput } from "@/components/panel/form-controls";
import type { MediaKind } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { isAllowedImageReference } from "@/lib/media/reference";
import { getMediaKindLabel } from "@/lib/media/labels";

export type MediaSelection = { url: string; originalName?: string; altFa?: string | null; altEn?: string | null };
type PickerTab = "library" | "upload" | "link";
type LibraryAsset = MediaSelection & { id: string; originalName: string; kind: MediaKind; size: number };

type MediaPickerDialogProps = { open: boolean; locale: Locale; kind: MediaKind; initialTab?: PickerTab; onClose: () => void; onSelect: (selection: MediaSelection) => void };

export function MediaPickerDialog({ open, ...props }: MediaPickerDialogProps) {
  if (!open) return null;
  return <MediaPickerContent {...props} />;
}

function MediaPickerContent({ locale, kind, initialTab = "library", onClose, onSelect }: Omit<MediaPickerDialogProps, "open">) {
  const [tab, setTab] = useState<PickerTab>(initialTab);
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(initialTab === "library");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [originalName, setOriginalName] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { toast } = useFeedback();
  const isFa = locale === "fa";
  const labels = isFa
    ? { title: "انتخاب تصویر", library: "کتابخانه", upload: "بارگذاری", link: "استفاده از لینک", close: "بستن", chooseFile: "انتخاب فایل تصویر", use: "استفاده از تصویر", empty: "هنوز تصویری در کتابخانه نیست.", loading: "در حال دریافت رسانه‌ها…", invalid: "نشانی تصویر معتبر نیست." }
    : { title: "Choose image", library: "Library", upload: "Upload", link: "Use link", close: "Close", chooseFile: "Choose image file", use: "Use image", empty: "The media library is empty.", loading: "Loading media…", invalid: "Enter a valid image URL." };

  useEffect(() => {
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); document.body.style.overflow = previousOverflow; active?.focus(); };
  }, [onClose]);

  useEffect(() => {
    if (tab !== "library") return;
    const controller = new AbortController();
    let active = true;
    fetch("/api/uploads", { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as { assets?: LibraryAsset[]; error?: string };
        if (!response.ok) throw new Error(result.error || "Load failed");
        if (active) setAssets(result.assets || []);
      })
      .catch((cause) => { if (active && (cause as Error).name !== "AbortError") setError(isFa ? "دریافت کتابخانه انجام نشد." : "The media library could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [isFa, tab]);

  const chooseTab = (nextTab: PickerTab) => {
    setTab(nextTab);
    setError("");
    if (nextTab === "library") setLoading(true);
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    const data = new FormData();
    data.set("file", file);
    data.set("kind", kind);
    data.set("originalName", originalName);
    try {
      const response = await fetch("/api/uploads", { method: "POST", body: data });
      const result = await response.json() as { url?: string; originalName?: string; altFa?: string | null; altEn?: string | null; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Upload failed");
      toast.success(isFa ? "تصویر بارگذاری شد." : "Image uploaded.");
      onSelect(result as MediaSelection);
      onClose();
    } catch {
      setError(isFa ? "بارگذاری انجام نشد. فرمت و اندازه تصویر را بررسی کنید." : "Upload failed. Check the image format and size.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const useLink = () => {
    const nextLink = link.trim();
    if (!isAllowedImageReference(nextLink) || !nextLink) { setError(labels.invalid); return; }
    onSelect({ url: nextLink });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-zinc-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="media-picker-title" className="flex max-h-[min(48rem,calc(100dvh-2rem))] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white text-start shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div><h2 id="media-picker-title" className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{labels.title}</h2><p className="mt-1 text-xs text-zinc-500">{isFa ? "تصویر را بارگذاری کنید، از کتابخانه بردارید یا لینک آن را وارد کنید." : "Upload, reuse an existing asset, or enter an image URL."}</p></div>
          <button ref={closeButton} type="button" aria-label={labels.close} onClick={onClose} className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800">×</button>
        </header>
        <div role="tablist" className="flex gap-1 border-b border-zinc-200 bg-zinc-50 px-4 pt-3 dark:border-zinc-800 dark:bg-zinc-950/50">
          {(["library", "upload", "link"] as PickerTab[]).map((item) => <button key={item} type="button" onClick={() => chooseTab(item)} aria-selected={tab === item} role="tab" className="cursor-pointer rounded-t-xl px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-950 aria-selected:bg-white aria-selected:text-emerald-700 dark:hover:text-white dark:aria-selected:bg-zinc-900 dark:aria-selected:text-emerald-300">{item === "library" ? labels.library : item === "upload" ? labels.upload : labels.link}</button>)}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {tab === "library" ? loading ? <p className="py-16 text-center text-sm text-zinc-500">{labels.loading}</p> : assets.length ? <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">{assets.map((asset) => <button key={asset.id} type="button" onClick={() => { onSelect(asset); onClose(); }} className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white text-start transition hover:border-emerald-400 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-emerald-700"><span className="block aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800"><img src={asset.url} alt={isFa ? asset.altFa || "" : asset.altEn || ""} className="size-full object-cover transition group-hover:scale-105" /></span><span className="block truncate px-3 pt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{asset.originalName}</span><span className="block px-3 pb-3 pt-1 text-xs text-zinc-500">{getMediaKindLabel(asset.kind, locale)}</span></button>)}</div> : <p className="py-16 text-center text-sm text-zinc-500">{labels.empty}</p> : null}
          {tab === "upload" ? <div className="mx-auto max-w-xl space-y-4 py-8 text-start"><label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{isFa ? "نام نمایشی (اختیاری)" : "Display name (optional)"}<PanelInput value={originalName} onChange={(event) => setOriginalName(event.target.value)} maxLength={255} className="mt-2" placeholder={isFa ? "برای نمونه: تصویر کلاس رباتیک" : "For example: Robotics class photo"} /><span className="mt-1.5 block text-xs leading-5 text-zinc-500">{isFa ? "این نام می‌تواند تکراری باشد؛ نام فایل ذخیره‌شده به‌صورت امن و تصادفی ساخته می‌شود." : "This name may be duplicated; the stored filename is generated securely and randomly."}</span></label><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /><button type="button" disabled={uploading} onClick={() => fileInput.current?.click()} className="w-full rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center font-semibold text-zinc-700 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30">{uploading ? (isFa ? "در حال بارگذاری…" : "Uploading…") : labels.chooseFile}<span className="mt-2 block text-xs font-normal text-zinc-500">JPEG, PNG, WebP, GIF · 5 MB</span></button></div> : null}
          {tab === "link" ? <div className="mx-auto max-w-xl space-y-4 py-8"><label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{isFa ? "نشانی مستقیم تصویر" : "Direct image URL"}<PanelInput value={link} onChange={(event) => setLink(event.target.value)} dir="ltr" className="nums-en mt-2" placeholder="https://example.com/image.jpg" /></label>{link && isAllowedImageReference(link) ? <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-950"><img src={link} alt="" className="mx-auto max-h-64 rounded-xl object-contain" /></div> : null}<button type="button" onClick={useLink} className="w-full cursor-pointer rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950">{labels.use}</button></div> : null}
          {error ? <p role="alert" className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </div>
      </section>
    </div>
  );
}
