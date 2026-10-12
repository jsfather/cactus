"use client";
import { useState } from "react";
import { FormLabel, PanelInput } from "@/components/panel/form-controls";
import { useFeedback } from "@/components/feedback/feedback-provider";
import type { Locale } from "@/lib/i18n/config";
import { text } from "@/lib/workflows";
import { VoiceRecorder } from "@/components/support/voice-recorder";
export function AttachmentField({
  name,
  label,
  locale,
  initialValue = "",
  videoOnly = false,
}: {
  name: string;
  label: string;
  locale: Locale;
  initialValue?: string;
  videoOnly?: boolean;
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
        accept={
          videoOnly
            ? ".mp4,video/mp4"
            : ".pdf,.jpg,.jpeg,.png,.webp,.zip,.mp4,.webm"
        }
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (videoOnly && file.type !== "video/mp4") {
            toast.error(
              text(
                locale,
                "فقط فایل MP4 مجاز است.",
                "Only MP4 videos are allowed.",
              ),
            );
            return;
          }
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
          : videoOnly
            ? text(
                locale,
                "فایل MP4 تا ۲۰ مگابایت، یا لینک مستقیم ویدیو. ویدیوی بارگذاری‌شده پس از انتشار لندینگ عمومی می‌شود.",
                "MP4 up to 20 MB or a direct video URL. Uploaded videos become public when the landing is published.",
              )
            : text(
                locale,
                "PDF، تصویر، ZIP، MP4 یا صدای WebM تا ۲۰ مگابایت. برای تیکت از فایل بارگذاری‌شده استفاده کنید.",
                "PDF, image, ZIP, MP4 or WebM audio up to 20 MB. Tickets require an uploaded file.",
              )}
      </p>
      {!videoOnly && <VoiceRecorder locale={locale} onUploaded={setValue} />}
    </div>
  );
}
