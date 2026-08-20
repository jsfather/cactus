"use client";

import { useId, useRef, useState } from "react";
import { useFeedback } from "@/components/feedback/feedback-provider";
import type { Locale } from "@/lib/i18n/config";
import type { MediaKind } from "@/lib/db/schema";

export function ImageUploadField({
  name,
  kind,
  locale,
  initialValue = "",
  label,
  hint,
  aspect = "video",
  layout = "responsive",
}: {
  name: string;
  kind: MediaKind;
  locale: Locale;
  initialValue?: string;
  label: string;
  hint?: string;
  aspect?: "square" | "video";
  layout?: "responsive" | "stacked";
}) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const { toast } = useFeedback();
  const isFa = locale === "fa";

  const invalidFileMessage = isFa
    ? "فایل باید JPEG، PNG، WebP یا GIF و حداکثر ۵ مگابایت باشد."
    : "Use a JPEG, PNG, WebP, or GIF image no larger than 5 MB.";

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    const data = new FormData();
    data.set("file", file);
    data.set("kind", kind);

    try {
      const response = await fetch("/api/uploads", { method: "POST", body: data });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Upload failed");
      setValue(result.url);
      toast.success(isFa ? "تصویر بارگذاری شد." : "Image uploaded.");
    } catch {
      const message = isFa
        ? "بارگذاری تصویر انجام نشد. فرمت و اندازه فایل را بررسی کنید."
        : "The image could not be uploaded. Check its format and size.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const selectFile = (file: File) => {
    const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!supportedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError(invalidFileMessage);
      toast.error(invalidFileMessage);
      return;
    }

    void upload(file);
  };

  return (
    <div className="space-y-2.5">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</label>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {hint || (isFa ? "JPEG، PNG، WebP یا GIF · حداکثر ۵ مگابایت" : "JPEG, PNG, WebP, or GIF · Max 5 MB")}
        </span>
      </div>
      <div
        aria-busy={busy}
        onDragEnter={(event) => { event.preventDefault(); if (!busy) setDragging(true); }}
        onDragOver={(event) => { event.preventDefault(); if (!busy) setDragging(true); }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file && !busy) selectFile(file);
        }}
        className={`grid gap-4 rounded-2xl border p-4 transition sm:items-center ${aspect === "video" && layout === "responsive" ? "sm:grid-cols-[13rem_minmax(0,1fr)]" : ""} ${dragging ? "border-emerald-500 bg-emerald-50/80 ring-3 ring-emerald-500/10 dark:border-emerald-500 dark:bg-emerald-950/25" : "border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/50"}`}
      >
        <div
          className={`${aspect === "square" ? "aspect-square w-32" : `aspect-video w-full ${layout === "responsive" ? "sm:w-52" : ""}`} relative mx-auto shrink-0 overflow-hidden rounded-xl border ${value ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950" : "border-dashed border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={isFa ? "پیش‌نمایش تصویر انتخاب‌شده" : "Selected image preview"} className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center text-zinc-400 dark:text-zinc-500">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <circle cx="9" cy="10" r="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 18 4.5-4 3 2.5 2.5-2 4 3.5" />
              </svg>
            </div>
          )}
          {busy ? (
            <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80">
              <span className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600 dark:border-zinc-700 dark:border-t-emerald-400" />
            </div>
          ) : null}
        </div>
        <div className="min-w-0 text-start">
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) selectFile(file);
            }}
          />
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {value
              ? isFa ? "تصویر آماده استفاده است" : "Image ready to use"
              : dragging
                ? isFa ? "تصویر را اینجا رها کنید" : "Drop the image here"
                : isFa ? "تصویر را بکشید و اینجا رها کنید" : "Drag and drop an image here"}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {value
              ? isFa ? "با انتخاب تصویر دیگر می‌توانید آن را جایگزین کنید." : "Choose another image whenever you need to replace it."
              : isFa ? "یا از دکمه زیر برای انتخاب فایل استفاده کنید." : "Or use the button below to browse your files."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 11v3.5A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5V11" /></svg>
              {busy
                ? isFa ? "در حال بارگذاری…" : "Uploading…"
                : value
                  ? isFa ? "تغییر تصویر" : "Replace image"
                  : isFa ? "انتخاب تصویر" : "Choose image"}
            </button>
            {value ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => { setValue(""); setError(""); }}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-600 transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
              >
                <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3.5 5.5h13M8 8.5v5m4-5v5M6 5.5l.6 10h6.8l.6-10M8 5.5V4h4v1.5" /></svg>
                {isFa ? "حذف از محتوا" : "Remove from content"}
              </button>
            ) : null}
          </div>
          {error ? <p role="alert" className="mt-2 text-xs leading-5 text-red-600 dark:text-red-400">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
