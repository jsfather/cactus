"use client";
import { useState } from "react";
import { FormLabel, PanelInput } from "@/components/panel/form-controls";
import { useFeedback } from "@/components/feedback/feedback-provider";
import type { Locale } from "@/lib/i18n/config";
import { text } from "@/lib/workflows";
export function AttachmentField({
  name,
  label,
  locale,
  initialValue = "",
}: {
  name: string;
  label: string;
  locale: Locale;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const { toast } = useFeedback();
  return (
    <div className="space-y-3">
      <FormLabel label={label}>
        <PanelInput
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          dir="ltr"
        />
      </FormLabel>
      <PanelInput
        type="file"
        aria-label={text(locale, "بارگذاری فایل", "Upload attachment")}
        disabled={busy}
        accept=".pdf,.jpg,.jpeg,.png,.webp,.zip,.mp4"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 20 * 1024 * 1024) {
            toast.error(
              text(
                locale,
                "حداکثر حجم فایل ۲۰ مگابایت است.",
                "Maximum file size is 20 MB.",
              ),
            );
            return;
          }
          setBusy(true);
          try {
            const body = new FormData();
            body.set("file", file);
            const response = await fetch("/api/attachments", {
              method: "POST",
              body,
            });
            if (!response.ok) throw new Error();
            const data = await response.json();
            setValue(data.url);
            toast.success(text(locale, "فایل بارگذاری شد.", "File uploaded."));
          } catch {
            toast.error(
              text(
                locale,
                "بارگذاری انجام نشد؛ نوع و حجم فایل را بررسی کنید.",
                "Upload failed. Check the file type and size.",
              ),
            );
          } finally {
            setBusy(false);
          }
        }}
      />
      <p className="text-xs text-zinc-500">
        {busy
          ? text(locale, "در حال بارگذاری…", "Uploading…")
          : text(
              locale,
              "PDF، تصویر، ZIP یا MP4 تا ۲۰ مگابایت؛ یا پیوند فایل را وارد کنید.",
              "PDF, image, ZIP, or MP4 up to 20 MB; or enter a file link.",
            )}
      </p>
    </div>
  );
}
