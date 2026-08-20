"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FormLabel, PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass } from "@/components/panel/ui";
import type { MediaKind } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getMediaKindLabel } from "@/lib/media/labels";

const kinds: MediaKind[] = ["content", "post", "product", "avatar"];

export function MediaCreateForm({ locale }: { locale: Locale }) {
  const dictionary = getPanelDictionary(locale);
  const router = useRouter();
  const { toast } = useFeedback();
  const { bind, setValues, values } = usePreservedFields({ kind: "content", originalName: "", altFa: "", altEn: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFa = locale === "fa";

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const chooseFile = (nextFile: File | null) => {
    setFile(nextFile);
    setPreview(nextFile ? URL.createObjectURL(nextFile) : "");
    if (nextFile) {
      setValues((current) => ({
        ...current,
        originalName: current.originalName || nextFile.name.slice(0, 255),
      }));
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast.error(isFa ? "یک فایل تصویر انتخاب کنید." : "Choose an image file.");
      return;
    }
    setPending(true);
    const data = new FormData();
    data.set("file", file);
    data.set("kind", values.kind);
    data.set("originalName", values.originalName);
    data.set("altFa", values.altFa);
    data.set("altEn", values.altEn);

    try {
      const response = await fetch("/api/uploads", { method: "POST", body: data });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Upload failed");
      toast.success(isFa ? "تصویر بارگذاری شد." : "Image uploaded.");
      router.push("/panel/admin/media?toast=created");
      router.refresh();
    } catch {
      toast.error(isFa ? "بارگذاری تصویر انجام نشد. فایل و اطلاعات را بررسی کنید." : "The image could not be uploaded. Check the file and metadata.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <PanelFormSection title={dictionary.media.file} description={isFa ? "تصویر جدید را انتخاب کنید؛ فایل بلافاصله به کتابخانه افزوده می‌شود." : "Choose a new image; it will be added directly to the media library."}>
          <button type="button" onClick={() => inputRef.current?.click()} className="grid min-h-72 w-full cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 transition hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20">
            {preview ? <span className="block"><img src={preview} alt="" className="mx-auto max-h-64 rounded-xl object-contain" /><span className="nums-en mt-3 block text-sm text-zinc-600 dark:text-zinc-300" dir="ltr">{file?.name}</span></span> : <span className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">+</span><span className="mt-4 block font-medium">{isFa ? "انتخاب تصویر" : "Choose image"}</span><span className="mt-2 block text-xs text-zinc-500">JPEG, PNG, WebP, GIF · 5 MB</span></span>}
          </button>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} />
        </PanelFormSection>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <PanelFormSection title={isFa ? "اطلاعات رسانه" : "Media details"}>
            <div className="space-y-5">
              <FormLabel label={dictionary.media.originalName} hint={dictionary.media.nameHint}><PanelInput {...bind("originalName")} maxLength={255} /></FormLabel>
              <FormLabel label={dictionary.media.kind}><PanelSelect {...bind("kind")}>{kinds.map((kind) => <option key={kind} value={kind}>{getMediaKindLabel(kind, locale)}</option>)}</PanelSelect></FormLabel>
              <FormLabel label={dictionary.media.altFa}><PanelInput {...bind("altFa")} dir="rtl" /></FormLabel>
              <FormLabel label={dictionary.media.altEn}><PanelInput {...bind("altEn")} dir="ltr" className="nums-en" /></FormLabel>
            </div>
          </PanelFormSection>
        </aside>
      </div>
      <PanelFormFooter message={dictionary.media.description}><button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? (isFa ? "در حال بارگذاری…" : "Uploading…") : dictionary.media.newAsset}</button></PanelFormFooter>
    </form>
  );
}
