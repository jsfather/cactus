"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelInput } from "@/components/panel/form-controls";
import { formatPanelDate } from "@/lib/date/panel";
import {
  ChatAvatar,
  MessageBubble,
  MessengerIcon,
  messengerBackground,
  messengerIconButton,
} from "./messenger-ui";
import { MessageComposer } from "./message-composer";
type Conversation = {
  id: string;
  name: string;
  mobile: string;
  status: string;
  operatorId: string | null;
  operatorName?: string | null;
  operatorAvatarUrl?: string | null;
  peerTyping?: boolean;
  lastMessageAt?: string;
};
type ChatData = {
  isAdmin?: boolean;
  historyAvailable: boolean;
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
    readAt: string | null;
    authorName?: string;
    avatarUrl?: string | null;
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
  const fa = locale === "fa",
    t = (f: string, e: string) => (fa ? f : e);
  const [ready, setReady] = useState(inbox),
    [open, setOpen] = useState(inbox),
    [hint, setHint] = useState(true),
    [data, setData] = useState<ChatData | null>(null),
    [name, setName] = useState(""),
    [mobile, setMobile] = useState(""),
    [body, setBody] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState<string | null>(null),
    [historyPage, setHistoryPage] = useState(1),
    [messagePage, setMessagePage] = useState(1),
    [available, setAvailable] = useState(true);
  const bottom = useRef<HTMLDivElement>(null),
    sequence = useRef(0),
    lastTyping = useRef(0),
    acks = useRef(new Set<string>()),
    floating = useRef<HTMLButtonElement>(null),
    { toast, confirm } = useFeedback();
  const refresh = useCallback(
    async (idOverride?: string | null, restore = false) => {
      const revision = ++sequence.current;
      try {
        const url = new URL("/api/live-chat", window.location.origin);
        url.searchParams.set("locale", locale);
        url.searchParams.set("messagePage", String(messagePage));
        if (inbox) {
          url.searchParams.set("inbox", "1");
          url.searchParams.set("historyPage", String(historyPage));
        }
        const id = idOverride === undefined ? selected : idOverride;
        if (id) url.searchParams.set("id", id);
        if (restore && !inbox) url.searchParams.set("restore", "1");
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          if (response.status === 404 && revision === sequence.current) {
            setSelected(null);
            setData(null);
          }
          throw Error();
        }
        const result = (await response.json()) as ChatData;
        if (revision !== sequence.current) return;
        setData(result);
        setAvailable(true);
        if (restore && result.conversation) setSelected(result.conversation.id);
      } catch {
        if (revision === sequence.current) setAvailable(false);
      }
    },
    [inbox, locale, selected, historyPage, messagePage],
  );
  const signal = useCallback(
    async (payload: object) => {
      try {
        return await fetch("/api/live-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, inbox }),
        });
      } catch {
        return null;
      }
    },
    [inbox],
  );
  const visible = useCallback(
    (id: string) => {
      if (!data?.conversation || acks.current.has(id)) return;
      acks.current.add(id);
      void signal({
        operation: "read",
        id: data.conversation.id,
        lastMessageId: id,
      }).then((result) => {
        if (!result?.ok) acks.current.delete(id);
      });
    },
    [data?.conversation, signal],
  );
  useEffect(() => {
    if (inbox) return;
    const timer = setTimeout(() => setReady(true), 10000);
    return () => clearTimeout(timer);
  }, [inbox]);
  useEffect(() => {
    if (!ready) return;
    const initial = setTimeout(() => void refresh(), 0);
    if (!open) return () => clearTimeout(initial);
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 2500);
    return () => {
      clearTimeout(initial);
      clearInterval(poll);
    };
  }, [ready, open, refresh]);
  useEffect(() => {
    if (!inbox) return;
    const heartbeat = () => {
      void signal({ operation: "presence" });
    };
    heartbeat();
    const timer = setInterval(heartbeat, 30000);
    return () => clearInterval(timer);
  }, [inbox, signal]);
  useEffect(() => {
    if (messagePage === 1) bottom.current?.scrollIntoView({ block: "nearest" });
  }, [data?.messages.length, selected, messagePage]);
  useEffect(() => {
    if (!open || inbox) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        floating.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, inbox]);
  const current = data?.conversation,
    canReply =
      current?.status === "open" &&
      (!inbox || current.operatorId === data?.operatorId);
  const changeBody = (value: string) => {
    setBody(value);
    if (current && canReply && Date.now() - lastTyping.current > 2000) {
      lastTyping.current = Date.now();
      void signal({
        operation: "typing",
        id: current.id,
        typing: Boolean(value.trim()),
      });
    }
  };
  async function send(operation: string) {
    if (busy) return;
    setBusy(true);
    try {
      const normalized = mobile
        .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
        .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
      const response = await signal(
        operation === "start"
          ? { operation, name, mobile: normalized, locale }
          : { operation, id: current?.id, body },
      );
      if (!response?.ok) throw Error();
      const result = await response.json();
      if (operation === "start") {
        setSelected(result.id);
        setMessagePage(1);
        await refresh(result.id);
      } else if (operation === "close" && !inbox) {
        setSelected(null);
        setBody("");
        setMessagePage(1);
        await refresh(null);
      } else if (operation === "delete") {
        setSelected(null);
        setMessagePage(1);
        await refresh(null);
        toast.success(t("گفت‌وگو حذف شد.", "Conversation deleted."));
      } else {
        if (operation === "reply") {
          setBody("");
          void signal({ operation: "typing", id: current?.id, typing: false });
        }
        await refresh();
      }
    } catch {
      toast.error(
        t(
          "عملیات انجام نشد؛ اطلاعات را بررسی کنید یا دوباره تلاش کنید.",
          "Could not complete the action. Check the details or retry.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function image(file: File) {
    if (!current || busy) return;
    if (
      !file.size ||
      file.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      toast.error(
        t(
          "تصویر JPEG، PNG یا WebP تا ۵ مگابایت مجاز است.",
          "JPEG, PNG or WebP up to 5 MB are allowed.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.set("id", current.id);
      form.set("file", file);
      if (inbox) form.set("inbox", "1");
      const response = await fetch("/api/live-chat", {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw Error();
      await refresh();
    } catch {
      toast.error(t("تصویر ارسال نشد.", "Could not send the image."));
    } finally {
      setBusy(false);
    }
  }
  if (!ready || (!inbox && data?.settings.enabled === "false")) return null;
  const color = data?.settings.color || "#009b69";
  const conversation = (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-3">
          <ChatAvatar
            src={
              inbox
                ? null
                : current?.operatorAvatarUrl || data?.settings.logoUrl
            }
            name={
              inbox
                ? (current?.name ?? "")
                : current?.operatorName ||
                  t("پشتیبانی کاکتوس", "Cactus support")
            }
            system={!inbox && !current?.operatorName}
          />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold">
              {inbox
                ? current?.name ||
                  t("گفت‌وگو را انتخاب کنید", "Select a conversation")
                : current?.operatorName ||
                  t("پشتیبانی کاکتوس", "Cactus support")}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {inbox
                ? current?.mobile
                : `${data?.onlineCount.toLocaleString(locale) ?? "0"} ${t("پشتیبان آنلاین", "operators online")}`}
            </p>
          </div>
        </div>
        {!inbox && (
          <button
            type="button"
            className={messengerIconButton}
            aria-label={t("بستن پنجره", "Close window")}
            onClick={() => setOpen(false)}
          >
            <MessengerIcon kind="close" />
          </button>
        )}
      </header>
      {!available && (
        <p role="status" className="px-4 py-2 text-xs text-amber-700">
          {t(
            "ارتباط قطع شده؛ در حال تلاش مجدد…",
            "Connection interrupted; retrying…",
          )}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-2 text-xs dark:border-slate-800">
        <span className="text-slate-500">
          {current
            ? current.status === "open"
              ? t("گفت‌وگوی فعال", "Active conversation")
              : t("گفت‌وگوی بسته‌شده", "Closed conversation")
            : t("گفت‌وگوی جدید", "New conversation")}
        </span>
        {current?.status === "open" && canReply && (
          <button
            type="button"
            disabled={busy}
            className="font-semibold text-rose-600"
            onClick={async () => {
              if (
                await confirm({
                  title: t("پایان گفت‌وگو؟", "End conversation?"),
                  description: t(
                    "تاریخچه برای پشتیبانی محفوظ می‌ماند.",
                    "Support history will be retained.",
                  ),
                  confirmLabel: t("پایان گفت‌وگو", "End conversation"),
                })
              )
                void send("close");
            }}
          >
            {t("پایان گفت‌وگو", "End conversation")}
          </button>
        )}
        {!inbox && !current && data?.historyAvailable && (
          <button
            type="button"
            disabled={busy}
            className="font-semibold text-emerald-700 dark:text-emerald-300"
            onClick={() => {
              setMessagePage(1);
              void refresh(undefined, true);
            }}
          >
            {t("بارگذاری تاریخچه من", "Load my history")}
          </button>
        )}
        {inbox && current?.status === "open" && !canReply && (
          <button
            type="button"
            className="font-semibold text-emerald-700 dark:text-emerald-300"
            disabled={busy}
            onClick={() => void send("claim")}
          >
            {t("پذیرش گفت‌وگو", "Claim conversation")}
          </button>
        )}
      </div>
      <div
        className={`min-h-0 flex-1 space-y-4 overflow-y-auto p-4 ${current ? messengerBackground : "bg-white dark:bg-slate-950"}`}
        role="log"
        aria-live="polite"
        aria-label={t("پیام‌ها", "Messages")}
      >
        <div className="flex justify-center gap-3 text-xs text-emerald-700 dark:text-emerald-300">
          {current && data?.messagesHasMore && (
            <button
              type="button"
              onClick={() => setMessagePage((value) => value + 1)}
            >
              {t("پیام‌های قدیمی‌تر", "Older messages")}
            </button>
          )}
          {messagePage > 1 && (
            <button
              type="button"
              onClick={() => setMessagePage((value) => value - 1)}
            >
              {t("پیام‌های جدیدتر", "Newer messages")}
            </button>
          )}
        </div>
        {!current && (
          <div className="flex min-h-24 flex-col items-center justify-center gap-3 py-6 text-center">
            <ChatAvatar
              name={t("پشتیبانی", "Support")}
              src={data?.settings.logoUrl}
              system
            />
            <p className="max-w-xs text-sm leading-7 text-slate-500">
              {inbox
                ? t(
                    "از فهرست، گفت‌وگو را برای پاسخ‌گویی انتخاب کنید.",
                    "Select a conversation from the inbox.",
                  )
                : t(
                    "برای پرسیدن سوال، یک گفت‌وگوی جدید شروع کنید.",
                    "Start a new conversation to ask a question.",
                  )}
            </p>
          </div>
        )}
        {data?.messages.map((message) => (
          <MessageBubble
            key={message.id}
            locale={locale}
            onVisible={!inbox || canReply ? visible : undefined}
            message={{
              id: message.id,
              body: message.body,
              createdAt: message.createdAt,
              readAt: message.readAt,
              mine: message.sender === (inbox ? "operator" : "visitor"),
              system: message.sender === "system",
              name:
                message.sender === "visitor"
                  ? current?.name || t("شما", "You")
                  : message.authorName ||
                    current?.operatorName ||
                    t("پشتیبانی", "Support"),
              avatarUrl: message.avatarUrl,
              attachmentUrl: message.hasImage
                ? `/api/live-chat/image/${message.id}`
                : null,
              attachmentMime: message.hasImage ? "image/jpeg" : null,
            }}
          />
        ))}
        <div ref={bottom} />
      </div>
      <footer className="space-y-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
        <p className="min-h-4 text-xs text-emerald-600" role="status">
          {current?.peerTyping ? t("در حال نوشتن پیام…", "Typing…") : ""}
        </p>
        {canReply ? (
          <MessageComposer
            locale={locale}
            body={body}
            onBodyChange={changeBody}
            onSend={() => void send("reply")}
            onFile={image}
            pending={busy}
            maxLength={5000}
            accent={color}
            onBlur={() =>
              void signal({
                operation: "typing",
                id: current?.id,
                typing: false,
              })
            }
          />
        ) : !inbox && (!current || current.status === "closed") ? (
          <form
            className="grid min-w-0 gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void send("start");
            }}
          >
            <p className="text-xs leading-6 text-slate-500">
              {t(
                "برای شروع، نام و شماره موبایل خود را وارد کنید.",
                "Enter your name and mobile to begin.",
              )}
            </p>
            <label className="text-xs">
              <span className="sr-only">{t("نام", "Name")}</span>
              <PanelInput
                required
                minLength={2}
                maxLength={160}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder={t("نام شما", "Your name")}
              />
            </label>
            <label className="text-xs">
              <span className="sr-only">{t("موبایل", "Mobile")}</span>
              <PanelInput
                required
                type="tel"
                dir="ltr"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                autoComplete="tel"
                placeholder="09xxxxxxxxx"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !available}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: color }}
            >
              <MessengerIcon kind="send" />
              {t("شروع گفت‌وگو", "Start conversation")}
            </button>
          </form>
        ) : (
          <p className="text-center text-xs leading-6 text-slate-500">
            {current?.status === "closed"
              ? t(
                  "این گفت‌وگو پایان یافته است.",
                  "This conversation has ended.",
                )
              : t(
                  "برای پاسخ‌گویی، گفت‌وگو را بپذیرید.",
                  "Claim the conversation to reply.",
                )}
          </p>
        )}
        {inbox && data?.isAdmin && current?.status === "closed" && (
          <button
            type="button"
            className="text-xs text-rose-600"
            disabled={busy}
            onClick={async () => {
              if (
                await confirm({
                  title: t("حذف گفت‌وگو؟", "Delete conversation?"),
                  description: t(
                    "پیام‌ها و تصاویر برای همیشه حذف می‌شوند.",
                    "Messages and images will be permanently deleted.",
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
      </footer>
    </section>
  );
  if (inbox)
    return (
      <div className="grid min-w-0 gap-4 lg:h-[min(820px,85dvh)] lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="max-h-64 overflow-y-auto rounded-3xl border border-slate-200 bg-white lg:max-h-none dark:border-slate-700 dark:bg-slate-950">
          <h2 className="border-b border-slate-100 p-4 text-sm font-bold dark:border-slate-800">
            {t("گفت‌وگوهای پشتیبانی", "Support conversations")}
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data?.history.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-current={item.id === current?.id ? "page" : undefined}
                className="flex w-full cursor-pointer gap-3 p-4 text-start transition hover:bg-slate-50 aria-[current=page]:bg-emerald-50 dark:hover:bg-slate-900 dark:aria-[current=page]:bg-emerald-950/40"
                onClick={() => {
                  setSelected(item.id);
                  setMessagePage(1);
                  setBody("");
                }}
              >
                <ChatAvatar name={item.name} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {item.name}
                  </span>
                  <span
                    className="nums-en mt-1 block text-xs text-slate-500"
                    dir="ltr"
                  >
                    {item.mobile}
                  </span>
                  <span className="mt-2 block text-[10px] text-slate-500">
                    {item.status === "open"
                      ? t("باز", "Open")
                      : t("بسته", "Closed")}
                    {item.lastMessageAt
                      ? ` · ${formatPanelDate(item.lastMessageAt, locale)}`
                      : ""}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-between gap-3 p-4 text-xs text-emerald-700 dark:text-emerald-300">
            {historyPage > 1 && (
              <button
                onClick={() => {
                  setHistoryPage((value) => value - 1);
                  setSelected(null);
                  setMessagePage(1);
                }}
              >
                {t("جدیدتر", "Newer")}
              </button>
            )}
            {data?.historyHasMore && (
              <button
                onClick={() => {
                  setHistoryPage((value) => value + 1);
                  setSelected(null);
                  setMessagePage(1);
                }}
              >
                {t("قدیمی‌تر", "Older")}
              </button>
            )}
          </div>
        </aside>
        <div className="h-[min(650px,80dvh)] min-h-0 lg:h-full">
          {conversation}
        </div>
      </div>
    );
  return (
    <div
      className="fixed bottom-4 end-4 z-[80] max-w-[calc(100vw-2rem)]"
      dir={fa ? "rtl" : "ltr"}
    >
      {open ? (
        <div className="mb-3 h-[min(680px,82dvh)] w-[390px] max-w-full">
          {conversation}
        </div>
      ) : (
        hint && (
          <div className="mb-3 max-w-xs rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-7 shadow-lg dark:border-slate-700 dark:bg-slate-950">
            <button
              className="float-end p-1"
              type="button"
              onClick={() => setHint(false)}
              aria-label={t("بستن پیام", "Dismiss greeting")}
            >
              <MessengerIcon kind="close" />
            </button>
            {data?.settings.greeting ||
              t(
                "اگر سوالی دارید همکاران ما در بخش پشتیبانی در خدمت شما هستند.",
                "Have a question? Our support team is here to help.",
              )}
            <button
              type="button"
              className="mt-2 block font-semibold text-emerald-600"
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
        ref={floating}
        type="button"
        aria-expanded={open}
        aria-label={t("گفت‌وگو با پشتیبانی", "Chat with support")}
        className="ms-auto grid size-14 cursor-pointer place-items-center rounded-full text-white shadow-lg"
        style={{ backgroundColor: color }}
        onClick={() => {
          setOpen((value) => !value);
          setHint(false);
        }}
      >
        <MessengerIcon kind={open ? "close" : "chat"} />
      </button>
    </div>
  );
}
