"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { formatPanelDate } from "@/lib/date/panel";
import { PanelInput, PanelTextarea } from "@/components/panel/form-controls";
import {
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/panel/ui";
import { useFeedback } from "@/components/feedback/feedback-provider";
type Conversation = {
  operatorName?: string | null;
  id: string;
  name: string;
  mobile: string;
  status: string;
  operatorId: string | null;
};
type ChatData = {
  isAdmin?: boolean;
  historyHasMore: boolean;
  messagesHasMore: boolean;
  history: Conversation[];
  conversation: Conversation | null;
  messages: {
    id: string;
    sender: string;
    body: string;
    hasImage: boolean;
    createdAt: string;
  }[];
  onlineCount: number;
  operatorId?: string;
  settings: {
    enabled: string;
    color: string;
    logoUrl: string;
    greeting: string;
    idleMinutes: number;
  };
  officeOpen: boolean;
};

export function LiveChat({
  locale,
  inbox = false,
}: {
  locale: Locale;
  inbox?: boolean;
}) {
  const fa = locale === "fa";
  const t = (f: string, e: string) => (fa ? f : e);
  const [ready, setReady] = useState(inbox);
  const [open, setOpen] = useState(inbox);
  const [hint, setHint] = useState(true);
  const [data, setData] = useState<ChatData | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [available, setAvailable] = useState(true);
  const bottom = useRef<HTMLDivElement>(null);
  const { toast, confirm } = useFeedback();
  const refresh = useCallback(async () => {
    try {
      const url = new URL("/api/live-chat", window.location.origin);
      url.searchParams.set("locale", locale);
      url.searchParams.set("historyPage", String(historyPage));
      url.searchParams.set("messagePage", String(messagePage));
      if (inbox) url.searchParams.set("inbox", "1");
      if (selected) url.searchParams.set("id", selected);
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 404) setSelected(null);
        throw new Error();
      }
      const result = (await response.json()) as ChatData;
      setData(result);
      setAvailable(true);
    } catch {
      setAvailable(false);
    }
  }, [inbox, locale, selected, historyPage, messagePage]);
  useEffect(() => {
    if (inbox) return;
    const timer = setTimeout(() => setReady(true), 10000);
    return () => clearTimeout(timer);
  }, [inbox]);
  useEffect(() => {
    if (!ready) return;
    const initial = setTimeout(() => void refresh(), 0);
    if (!open) return () => clearTimeout(initial);
    const timer = setInterval(() => void refresh(), 5000);
    return () => {
      clearTimeout(initial);
      clearInterval(timer);
    };
  }, [ready, open, refresh]);
  useEffect(() => {
    if (!inbox) return;
    const heartbeat = () => {
      void fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "presence" }),
      });
    };
    heartbeat();
    const timer = setInterval(heartbeat, 30000);
    return () => clearInterval(timer);
  }, [inbox]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [data?.messages.length, selected]);
  useEffect(() => {
    if (!open || inbox) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, inbox]);
  async function send(operation: string) {
    if (busy) return;
    setBusy(true);
    try {
      const payload =
        operation === "start"
          ? {
              operation,
              name,
              mobile: mobile
                .replace(/[۰-۹]/g, (digit) =>
                  String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
                )
                .replace(/[٠-٩]/g, (digit) =>
                  String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
                ),
              locale,
            }
          : { operation, id: data?.conversation?.id, body };
      const response = await fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (operation === "start") setSelected(result.id);
      if (operation === "reply") setBody("");
      if (operation === "delete") {
        setSelected(null);
        setMessagePage(1);
        toast.success(t("گفت‌وگو حذف شد.", "Conversation deleted."));
      }
      await refresh();
    } catch {
      toast.error(
        t(
          "ارسال انجام نشد؛ اطلاعات را بررسی کنید یا دوباره تلاش کنید.",
          "Could not send. Check the details or try again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function image(file: File) {
    if (!data?.conversation || busy) return;
    if (
      !file.size ||
      file.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      toast.error(
        t(
          "تصویر JPEG، PNG یا WebP تا ۵ مگابایت مجاز است.",
          "JPEG, PNG or WebP images up to 5 MB are allowed.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.set("id", data.conversation.id);
      form.set("file", file);
      const response = await fetch("/api/live-chat", {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error();
      await refresh();
    } catch {
      toast.error(t("تصویر ارسال نشد.", "Could not send the image."));
    } finally {
      setBusy(false);
    }
  }
  if (!ready || (!inbox && data?.settings.enabled === "false")) return null;
  const color = data?.settings.color || "#009b69";
  const canReply =
    data?.conversation?.status === "open" &&
    (!inbox || data.conversation.operatorId === data.operatorId);
  const conversation = (
    <section
      aria-label={t("پشتیبانی آنلاین", "Live support")}
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-950"
    >
      <header
        className="flex items-center justify-between gap-3 p-4 text-white"
        style={{ backgroundColor: color }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {data?.settings.logoUrl && (
            <Image
              unoptimized
              src={data.settings.logoUrl}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-full object-contain"
            />
          )}
          <div>
            <h2 className="font-bold">
              {t("پشتیبانی کاکتوس", "Cactus support")}
            </h2>
            <p className="text-xs">
              {data?.onlineCount.toLocaleString(locale) ?? "0"}{" "}
              {t("پشتیبان آنلاین", "operators online")}
            </p>
            {data?.conversation?.operatorName && (
              <p className="text-xs">
                {t("پاسخ‌گو", "Operator")}: {data.conversation.operatorName}
              </p>
            )}
          </div>
        </div>
        {!inbox && (
          <button
            type="button"
            className="cursor-pointer rounded-lg px-2 py-1"
            aria-label={t("بستن پنجره", "Close window")}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        )}
      </header>
      {!available && (
        <p role="status" className="p-3 text-sm text-amber-700">
          {t(
            "ارتباط با پشتیبانی برقرار نشد. دوباره تلاش می‌کنیم.",
            "Support is unavailable. Retrying shortly.",
          )}
        </p>
      )}
      {data?.history.length ? (
        <label className="p-3 text-sm">
          {t("تاریخچه گفت‌وگو", "Conversation history")}
          <select
            aria-label={t("انتخاب گفت‌وگو", "Select conversation")}
            className="mt-2 w-full cursor-pointer rounded-lg border border-zinc-300 bg-transparent p-2 dark:border-zinc-700"
            value={data.conversation?.id ?? ""}
            onChange={(event) => {
              setSelected(event.target.value);
              setMessagePage(1);
            }}
          >
            {data.history.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.mobile} ·{" "}
                {item.status === "closed"
                  ? t("بسته", "Closed")
                  : t("باز", "Open")}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="flex flex-wrap gap-2 px-3 text-xs">
        {historyPage > 1 && (
          <button
            className="cursor-pointer text-emerald-600"
            onClick={() => {
              setHistoryPage((value) => value - 1);
              setSelected(null);
              setMessagePage(1);
            }}
          >
            {t("گفت‌وگوهای جدیدتر", "Newer conversations")}
          </button>
        )}
        {data?.historyHasMore && (
          <button
            className="cursor-pointer text-emerald-600"
            onClick={() => {
              setHistoryPage((value) => value + 1);
              setSelected(null);
              setMessagePage(1);
            }}
          >
            {t("گفت‌وگوهای قدیمی‌تر", "Older conversations")}
          </button>
        )}
        {messagePage > 1 && (
          <button
            className="cursor-pointer text-emerald-600"
            onClick={() => setMessagePage((value) => value - 1)}
          >
            {t("پیام‌های جدیدتر", "Newer messages")}
          </button>
        )}
        {data?.messagesHasMore && (
          <button
            className="cursor-pointer text-emerald-600"
            onClick={() => setMessagePage((value) => value + 1)}
          >
            {t("پیام‌های قدیمی‌تر", "Older messages")}
          </button>
        )}
      </div>
      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
        aria-label={t("پیام‌ها", "Messages")}
      >
        {!data?.conversation && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-7 dark:bg-emerald-950">
            {data?.settings.greeting ||
              t(
                "اگر سوالی دارید همکاران ما در بخش پشتیبانی در خدمت شما هستند.",
                "Have a question? Our support team is here to help.",
              )}
          </p>
        )}
        {data?.messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[90%] rounded-xl p-3 text-sm ${message.sender === (inbox ? "operator" : "visitor") ? "ms-auto bg-emerald-50 dark:bg-emerald-950" : "me-auto bg-zinc-100 dark:bg-zinc-900"}`}
          >
            <p className="whitespace-pre-wrap break-words leading-6">
              {message.body}
            </p>
            {message.hasImage && (
              <a
                href={`/api/live-chat/image/${message.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  unoptimized
                  width={640}
                  height={480}
                  src={`/api/live-chat/image/${message.id}`}
                  alt={t("تصویر پیوست گفت‌وگو", "Conversation image")}
                  loading="lazy"
                  className="mt-2 max-h-60 w-full rounded-lg object-contain"
                />
              </a>
            )}
            <time className="mt-2 block text-[10px] text-zinc-500">
              {formatPanelDate(message.createdAt, locale, true)}
            </time>
          </article>
        ))}
        <div ref={bottom} />
      </div>
      <div className="space-y-3 border-t border-zinc-200 p-4 dark:border-zinc-800">
        {inbox && data?.isAdmin && data.conversation?.status === "closed" && (
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={busy}
            onClick={async () => {
              if (
                await confirm({
                  title: t(
                    "حذف گفت‌وگوی بسته‌شده؟",
                    "Delete closed conversation?",
                  ),
                  description: t(
                    "تاریخچه و تصاویر این گفت‌وگو حذف می‌شوند و قابل بازگشت نیستند.",
                    "The conversation and its images will be permanently deleted.",
                  ),
                  confirmLabel: t("حذف", "Delete"),
                })
              )
                void send("delete");
            }}
          >
            {t("حذف گفت‌وگو", "Delete conversation")}
          </button>
        )}
        {!inbox &&
        (!data?.conversation || data.conversation.status === "closed") ? (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send("start");
            }}
          >
            <p className="text-sm">
              {t(
                "برای شروع گفت‌وگو نام و شماره موبایل را وارد کنید.",
                "Enter your name and mobile to start a conversation.",
              )}
            </p>
            <label className="block text-sm">
              {t("نام", "Name")}
              <PanelInput
                required
                maxLength={160}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="block text-sm">
              {t("موبایل", "Mobile")}
              <PanelInput
                required
                type="tel"
                dir="ltr"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                autoComplete="tel"
              />
            </label>
            <button
              className={primaryButtonClass}
              disabled={busy || !available}
            >
              {t("ارسال پیام و شروع گفت‌وگو", "Start conversation")}
            </button>
          </form>
        ) : canReply ? (
          <form
            className="space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              void send("reply");
            }}
          >
            <PanelTextarea
              aria-label={t("پیام", "Message")}
              rows={2}
              maxLength={5000}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                className={primaryButtonClass}
                disabled={busy || !body.trim()}
              >
                {t("ارسال", "Send")}
              </button>
              <label
                className={`${secondaryButtonClass} ${busy ? "pointer-events-none opacity-50" : ""}`}
              >
                {t("تصویر", "Image")}
                <input
                  type="file"
                  className="sr-only"
                  disabled={busy}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void image(file);
                    event.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                className={secondaryButtonClass}
                disabled={busy}
                onClick={async () => {
                  if (
                    await confirm({
                      title: t("پایان گفت‌وگو؟", "Close conversation?"),
                      description: t(
                        "تاریخچه محفوظ می‌ماند.",
                        "History will be retained.",
                      ),
                      confirmLabel: t("پایان", "Close"),
                    })
                  )
                    void send("close");
                }}
              >
                {t("پایان", "Close")}
              </button>
            </div>
          </form>
        ) : inbox && data?.conversation?.status === "open" ? (
          <button
            className={primaryButtonClass}
            disabled={busy}
            onClick={() => void send("claim")}
          >
            {t("پذیرش گفت‌وگو", "Claim conversation")}
          </button>
        ) : (
          <p className="text-sm">
            {t("گفت‌وگو بسته شده است.", "Conversation is closed.")}
          </p>
        )}
      </div>
    </section>
  );
  if (inbox)
    return (
      <div className="h-[min(780px,85dvh)] [&>section]:h-full">
        {conversation}
      </div>
    );
  return (
    <div
      className="fixed bottom-5 end-5 z-[80] max-w-[calc(100vw-2.5rem)]"
      dir={fa ? "rtl" : "ltr"}
    >
      {open ? (
        <div className="mb-3 h-[min(660px,80dvh)] w-[380px] max-w-full [&>section]:h-full">
          {conversation}
        </div>
      ) : (
        hint && (
          <div className="mb-3 max-w-xs rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-7 shadow-lg dark:border-zinc-700 dark:bg-zinc-950">
            <button
              type="button"
              className="float-end cursor-pointer px-2"
              onClick={() => setHint(false)}
              aria-label={t("بستن پیام", "Dismiss greeting")}
            >
              ×
            </button>
            {data?.settings.greeting ||
              t(
                "اگر سوالی دارید همکاران ما در بخش پشتیبانی در خدمت شما هستند.",
                "Have a question? Our support team is here to help.",
              )}
            <button
              className="mt-2 block cursor-pointer font-bold text-emerald-600"
              onClick={() => {
                setOpen(true);
                setHint(false);
              }}
            >
              {t("ارسال پیام", "Send a message")}
            </button>
          </div>
        )
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-label={t("گفت‌وگو با پشتیبانی", "Chat with support")}
        className="ms-auto flex size-14 cursor-pointer items-center justify-center rounded-full text-2xl text-white shadow-lg"
        style={{ backgroundColor: color }}
        onClick={() => {
          setOpen((value) => !value);
          setHint(false);
        }}
      >
        ☏
      </button>
    </div>
  );
}
