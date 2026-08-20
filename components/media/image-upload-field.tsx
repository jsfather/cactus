"use client";

import { useRef, useState } from "react";
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
}: {
  name: string;
  kind: MediaKind;
  locale: Locale;
  initialValue?: string;
  label: string;
  hint?: string;
  aspect?: "square" | "video";
}) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useFeedback();
  const isFa = locale === "fa";

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

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`${aspect === "square" ? "aspect-square w-32" : "aspect-video w-full sm:w-64"} relative shrink-0 overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center text-zinc-400">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <circle cx="9" cy="10" r="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 18 4.5-4 3 2.5 2.5-2 4 3.5" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950"
            >
              {busy
                ? isFa ? "در حال بارگذاری…" : "Uploading…"
                : value
                  ? isFa ? "تغییر تصویر" : "Replace image"
                  : isFa ? "انتخاب تصویر" : "Choose image"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => setValue("")}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 transition hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300"
              >
                {isFa ? "حذف از محتوا" : "Remove from content"}
              </button>
            ) : null}
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {hint || (isFa ? "JPEG، PNG، WebP یا GIF تا ۵ مگابایت" : "JPEG, PNG, WebP, or GIF up to 5 MB")}
          </p>
          {error ? <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
