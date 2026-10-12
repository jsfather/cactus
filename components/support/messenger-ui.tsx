"use client";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { formatPanelDate } from "@/lib/date/panel";
export function MessengerIcon({
  kind,
}: {
  kind: "send" | "clip" | "close" | "chat" | "back";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "send" ? (
        <path d="m3 3 18 9-18 9 4-9-4-9Zm4 9h14" />
      ) : kind === "clip" ? (
        <path d="m8 12 6-6a3 3 0 0 1 4 4L9 19a5 5 0 0 1-7-7l10-10a7 7 0 0 1 10 10l-9 9" />
      ) : kind === "close" ? (
        <path d="m6 6 12 12M6 18 18 6" />
      ) : kind === "back" ? (
        <path d="m14 5-7 7 7 7" />
      ) : (
        <path d="M4 4h16v13H9l-5 4V4Zm4 5h8M8 13h5" />
      )}
    </svg>
  );
}
export function ChatAvatar({
  src,
  name,
  system = false,
}: {
  src?: string | null;
  name: string;
  system?: boolean;
}) {
  return (
    <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-500 ring-2 ring-white dark:bg-slate-800 dark:ring-slate-900">
      {src ? (
        <Image
          unoptimized
          src={src}
          alt={name}
          width={36}
          height={36}
          className="size-full object-cover"
        />
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          {system ? (
            <path d="M4 5h16v12H9l-5 4V5Zm4 4h8M8 13h4" />
          ) : (
            <>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
            </>
          )}
        </svg>
      )}
    </span>
  );
}
export type MessengerMessage = {
  id: string;
  body: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
  readAt?: string | null;
  attachmentUrl?: string | null;
  attachmentMime?: string | null;
  system?: boolean;
  mine: boolean;
};
export function MessageBubble({
  message,
  locale,
  onVisible,
}: {
  message: MessengerMessage;
  locale: Locale;
  onVisible?: (id: string) => void;
}) {
  const ref = (element: HTMLDivElement | null) => {
    if (
      !element ||
      !onVisible ||
      message.mine ||
      message.system ||
      message.readAt
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some((entry) => entry.isIntersecting) &&
          document.visibilityState === "visible"
        ) {
          onVisible(message.id);
          observer.disconnect();
        }
      },
      { threshold: 0.7 },
    );
    observer.observe(element);
    const reobserve = () => {
      if (document.visibilityState === "visible") {
        observer.disconnect();
        observer.observe(element);
      }
    };
    document.addEventListener("visibilitychange", reobserve);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", reobserve);
    };
  };
  if (message.system)
    return (
      <p className="mx-auto max-w-[90%] rounded-2xl bg-white/75 px-4 py-2 text-center text-xs leading-6 text-slate-500 dark:bg-slate-900/70">
        {message.body}
      </p>
    );
  const fa = locale === "fa";
  return (
    <div
      ref={ref}
      className={`flex items-end gap-2 ${message.mine ? "ms-auto flex-row-reverse" : "me-auto"}`}
      style={{ maxWidth: "94%" }}
    >
      <ChatAvatar src={message.avatarUrl} name={message.name} />
      <article
        className={`min-w-0 rounded-2xl px-4 py-3 shadow-sm ${message.mine ? "rounded-ee-md bg-emerald-100 text-slate-900 dark:bg-emerald-900/70 dark:text-emerald-50" : "rounded-es-md bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}
      >
        <p className="mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          {message.name}
        </p>
        {message.body && (
          <p
            dir="auto"
            className="whitespace-pre-wrap break-words text-sm leading-7 [overflow-wrap:anywhere]"
          >
            {message.body}
          </p>
        )}
        {message.attachmentUrl &&
          (message.attachmentMime?.startsWith("image/") ? (
            <a
              href={message.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                unoptimized
                src={message.attachmentUrl}
                alt={fa ? "تصویر پیوست" : "Attached image"}
                width={640}
                height={480}
                className="mt-2 max-h-64 w-full rounded-xl object-contain"
              />
            </a>
          ) : message.attachmentMime?.startsWith("audio/") ? (
            <audio
              controls
              preload="none"
              src={message.attachmentUrl}
              className="mt-2 max-w-full"
              aria-label={fa ? "پیام صوتی" : "Voice message"}
            />
          ) : (
            <a
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold underline"
              href={message.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessengerIcon kind="clip" />
              {fa ? "فایل پیوست" : "Attachment"}
            </a>
          ))}
        <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-slate-500 dark:text-slate-400">
          <time
            dateTime={message.createdAt}
            title={formatPanelDate(message.createdAt, locale, true)}
          >
            {new Intl.DateTimeFormat(fa ? "fa-IR" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Asia/Tehran",
            }).format(new Date(message.createdAt))}
          </time>
          {message.mine && (
            <span
              role="img"
              aria-label={
                message.readAt
                  ? fa
                    ? "خوانده‌شده"
                    : "Read"
                  : fa
                    ? "ارسال‌شده"
                    : "Sent"
              }
              title={
                message.readAt
                  ? fa
                    ? "خوانده‌شده"
                    : "Read"
                  : fa
                    ? "ارسال‌شده"
                    : "Sent"
              }
              className={message.readAt ? "text-sky-600 dark:text-sky-300" : ""}
            >
              {message.readAt ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </article>
    </div>
  );
}
export const messengerBackground =
  "bg-[#edf3ef] dark:bg-[#101e21] [background-image:radial-gradient(#87a69a30_1px,transparent_1px)] [background-size:18px_18px]";
export const messengerIconButton =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800";
