"use client";
import { useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import { PanelTextarea } from "@/components/panel/form-controls";
import { MessengerIcon, messengerIconButton } from "./messenger-ui";
export function MessageComposer({
  locale,
  body,
  onBodyChange,
  onSend,
  onFile,
  pending,
  attachment,
  clearAttachment,
  onBlur,
  maxLength = 10000,
  accent,
}: {
  locale: Locale;
  body: string;
  onBodyChange: (body: string) => void;
  onSend: () => void;
  onFile: (file: File) => void;
  pending: boolean;
  attachment?: string;
  clearAttachment?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  accent?: string;
}) {
  const file = useRef<HTMLInputElement>(null),
    fa = locale === "fa";
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
      className="space-y-2"
    >
      <input
        ref={file}
        type="file"
        className="sr-only"
        disabled={pending}
        aria-label={fa ? "پیوست فایل" : "Attach a file"}
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onFile(selected);
          event.target.value = "";
        }}
      />
      {attachment && (
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs dark:bg-emerald-950">
          <span>{fa ? "پیوست آماده ارسال" : "Attachment ready"}</span>
          <button
            type="button"
            onClick={clearAttachment}
            className={messengerIconButton}
            aria-label={fa ? "حذف پیوست" : "Remove attachment"}
          >
            <MessengerIcon kind="close" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          type="button"
          className={messengerIconButton}
          disabled={pending}
          onClick={() => file.current?.click()}
          aria-label={fa ? "پیوست فایل" : "Attach file"}
          title={fa ? "پیوست فایل" : "Attach file"}
        >
          <MessengerIcon kind="clip" />
        </button>
        <PanelTextarea
          disabled={pending}
          rows={1}
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          onBlur={onBlur}
          maxLength={maxLength}
          aria-label={fa ? "متن پیام" : "Message"}
          placeholder={fa ? "پیام بنویسید…" : "Write a message…"}
          className="max-h-32 min-h-11 resize-y !rounded-2xl !py-3 !text-sm"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing &&
              (body.trim() || attachment)
            ) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          disabled={pending || (!body.trim() && !attachment)}
          className={`${messengerIconButton} bg-emerald-600 !text-white hover:bg-emerald-700`}
          style={accent ? { backgroundColor: accent } : undefined}
          aria-label={
            pending
              ? fa
                ? "در حال ارسال"
                : "Sending"
              : fa
                ? "ارسال پیام"
                : "Send message"
          }
          title={fa ? "ارسال پیام" : "Send message"}
        >
          {pending ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <MessengerIcon kind="send" />
          )}
        </button>
      </div>
    </form>
  );
}
