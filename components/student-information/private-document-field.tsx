"use client";

import { useId, useRef, useState } from "react";
import { useFeedback } from "@/components/feedback/feedback-provider";
import type { StudentDocumentKind } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

type DocumentValue = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
};

function formatSize(size: number, locale: Locale) {
  return `${new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1 }).format(size / 1024 / 1024)} MB`;
}

export function PrivateDocumentField({
  kind,
  locale,
  label,
  initialDocument,
  disabled = false,
}: {
  kind: StudentDocumentKind;
  locale: Locale;
  label: string;
  initialDocument: DocumentValue | null;
  disabled?: boolean;
}) {
  const [document, setDocument] = useState(initialDocument);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  async function upload(file: File) {
    const supported = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!supported.includes(file.type) || file.size < 1 || file.size > 5 * 1024 * 1024) {
      const message = isFa
        ? "فایل باید تصویر JPEG، PNG، WebP یا PDF و حداکثر ۵ مگابایت باشد."
        : "Use a JPEG, PNG, WebP, or PDF file no larger than 5 MB.";
      setError(message);
      toast.error(message);
      return;
    }

    setBusy(true);
    setError("");
    const data = new FormData();
    data.set("kind", kind);
    data.set("file", file);
    try {
      const response = await fetch("/api/student-documents", { method: "POST", body: data });
      const result = await response.json() as DocumentValue & { error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || "Upload failed");
      setDocument(result);
      toast.success(isFa ? "مدرک با امنیت بارگذاری شد." : "Document uploaded securely.");
    } catch {
      const message = isFa
        ? "بارگذاری مدرک انجام نشد. فرمت و اندازه فایل را بررسی کنید."
        : "The document could not be uploaded. Check its format and size.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    if (!document) return;
    const accepted = await confirm({
      title: isFa ? "حذف مدرک؟" : "Remove document?",
      description: isFa ? "این فایل خصوصی برای همیشه حذف می‌شود." : "This private file will be permanently removed.",
      confirmLabel: isFa ? "حذف مدرک" : "Remove document",
      cancelLabel: isFa ? "انصراف" : "Cancel",
    });
    if (!accepted) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/student-documents/${document.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setDocument(null);
      toast.success(isFa ? "مدرک حذف شد." : "Document removed.");
    } catch {
      toast.error(isFa ? "حذف مدرک انجام نشد." : "The document could not be removed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 p-5 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        disabled={disabled || busy}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h7l4 4V20.5H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" /><path d="M14 3.5v4h4" /><path strokeLinecap="round" d="M8.5 13h6M8.5 16h4" /></svg>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</h3>
      {document ? (
        <>
          <p className="nums-en mt-1 truncate text-xs text-zinc-500" dir="ltr">{document.originalName} · {formatSize(document.size, locale)}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <a target="_blank" rel="noreferrer" href={`/api/student-documents/${document.id}`} className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-emerald-400">
              {isFa ? "مشاهده امن" : "Secure view"}
            </a>
            {!disabled ? <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-950">{busy ? (isFa ? "در حال بارگذاری…" : "Uploading…") : (isFa ? "جایگزینی" : "Replace")}</button> : null}
            {!disabled ? <button type="button" disabled={busy} onClick={() => void remove()} className="cursor-pointer rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900 dark:bg-zinc-950 dark:text-red-400">{isFa ? "حذف" : "Remove"}</button> : null}
          </div>
        </>
      ) : (
        <>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{isFa ? "تصویر یا PDF، حداکثر ۵ مگابایت" : "Image or PDF, up to 5 MB"}</p>
          {!disabled ? <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950">{busy ? (isFa ? "در حال بارگذاری…" : "Uploading…") : (isFa ? "انتخاب فایل" : "Choose file")}</button> : null}
        </>
      )}
      {error ? <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
