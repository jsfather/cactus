"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { getTicketChat } from "@/lib/support/ticket-chat";
import type { Locale } from "@/lib/i18n/config";
import { formatPanelDate } from "@/lib/date/panel";
import {
  replyTicket,
  changeTicketStatus,
  rateTicket,
} from "@/lib/support/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelSelect, FieldError } from "@/components/panel/form-controls";
import { VoiceRecorder } from "./voice-recorder";
import { ChatAvatar, MessageBubble, messengerBackground } from "./messenger-ui";
import { MessageComposer } from "./message-composer";
type TicketData = NonNullable<Awaited<ReturnType<typeof getTicketChat>>>;
export function TicketConversation({
  initial,
  locale,
  admin = false,
}: {
  initial: TicketData;
  locale: Locale;
  admin?: boolean;
}) {
  const [data, setData] = useState(initial),
    [body, setBody] = useState(""),
    [attachment, setAttachment] = useState(""),
    [uploading, setUploading] = useState(false),
    [page, setPage] = useState(1),
    [errors, setErrors] = useState<Record<string, string[]>>({}),
    [pending, start] = useTransition();
  const { toast, confirm } = useFeedback(),
    fa = locale === "fa",
    bottom = useRef<HTMLDivElement>(null),
    lastTyping = useRef(0),
    acks = useRef(new Set<string>());
  const t = (f: string, e: string) => (fa ? f : e);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/tickets/${initial.ticket.id}?locale=${locale}&page=${page}`,
        { cache: "no-store" },
      );
      if (response.ok) setData(await response.json());
    } catch {
      /* Preserve visible messages during a transient interruption. */
    }
  }, [initial.ticket.id, locale, page]);
  const signal = useCallback(
    async (payload: object) => {
      try {
        return await fetch(`/api/tickets/${initial.ticket.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        return null;
      }
    },
    [initial.ticket.id],
  );
  const visible = useCallback(
    (id: string) => {
      if (acks.current.has(id)) return;
      acks.current.add(id);
      void signal({ operation: "read", lastMessageId: id }).then((result) => {
        if (!result?.ok) acks.current.delete(id);
      });
    },
    [signal],
  );
  useEffect(() => {
    const initialTimer = setTimeout(() => void refresh(), 0),
      poll = setInterval(() => {
        if (document.visibilityState === "visible") void refresh();
      }, 2500);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(poll);
    };
  }, [refresh]);
  useEffect(() => {
    if (page === 1) bottom.current?.scrollIntoView({ block: "nearest" });
  }, [data.messages.length, page]);
  const changeBody = (value: string) => {
    setBody(value);
    if (Date.now() - lastTyping.current > 2000) {
      lastTyping.current = Date.now();
      void signal({ operation: "typing", typing: Boolean(value.trim()) });
    }
  };
  const send = () =>
    start(async () => {
      const form = new FormData();
      form.set("locale", locale);
      form.set("body", body);
      form.set("attachmentUrl", attachment);
      try {
        const result = await replyTicket(data.ticket.id, {}, form);
        if (result.error) {
          setErrors(result.fieldErrors ?? {});
          toast.error(result.error);
        } else {
          setBody("");
          setAttachment("");
          setErrors({});
          void signal({ operation: "typing", typing: false });
          await refresh();
        }
      } catch {
        toast.error(t("پیام ارسال نشد.", "Could not send the message."));
      }
    });
  const file = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      toast.error(
        t("حداکثر حجم فایل ۲۰ مگابایت است.", "Maximum file size is 20 MB."),
      );
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/attachments", {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw Error();
      setAttachment((await response.json()).url);
    } catch {
      toast.error(
        t(
          "نوع یا حجم فایل مجاز نیست؛ بارگذاری انجام نشد.",
          "Upload failed. Check the file type and size.",
        ),
      );
    } finally {
      setUploading(false);
    }
  };
  const status = async (value: string) => {
    if (
      value === "closed" &&
      !(await confirm({
        title: t("بستن تیکت؟", "Close ticket?"),
        description: t(
          "تاریخچه باقی می‌ماند و می‌توانید تیکت را دوباره باز کنید.",
          "History is retained and the ticket can be reopened.",
        ),
        confirmLabel: t("بستن", "Close"),
      }))
    )
      return;
    start(async () => {
      try {
        const result = await changeTicketStatus(data.ticket.id, value, locale);
        if (result.error) toast.error(result.error);
        else {
          toast.success(t("وضعیت تغییر کرد.", "Status updated."));
          await refresh();
        }
      } catch {
        toast.error(t("وضعیت تغییر نکرد.", "Status could not be changed."));
      }
    });
  };
  const statusName = (value: string) =>
    ({
      open: t("در انتظار پاسخ", "Awaiting reply"),
      pending: t("پاسخ‌داده‌شده", "Answered"),
      closed: t("بسته‌شده", "Closed"),
    })[value] ?? value;
  const role = data.requester?.role;
  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <header className="space-y-4 border-b border-slate-200 px-4 py-5 sm:px-6 dark:border-slate-700">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ChatAvatar
              src={
                data.staff
                  ? data.requester?.avatarUrl
                  : data.operator?.avatarUrl
              }
              name={
                data.staff
                  ? (data.requester?.name ?? "")
                  : (data.operator?.name ??
                    t("پشتیبانی کاکتوس", "Cactus support"))
              }
            />
            <div className="min-w-0">
              <h1 className="text-base font-bold">{data.ticket.subject}</h1>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                {data.staff
                  ? data.requester?.name
                  : data.operator?.name ||
                    t("پشتیبانی کاکتوس", "Cactus support")}{" "}
                · {data.department}
              </p>
              {data.staff && data.requester?.mobile && (
                <p className="nums-en text-xs text-slate-500" dir="ltr">
                  {data.requester.mobile}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {!data.staff
                ? t("پشتیبانی", "Support")
                : role === "student"
                  ? t("دانش‌پژوه", "Student")
                  : role === "teacher"
                    ? t("مدرس", "Teacher")
                    : t("کاربر", "User")}
            </span>
            <label className="min-w-40 text-xs">
              <span className="sr-only">
                {t("وضعیت تیکت", "Ticket status")}
              </span>
              <PanelSelect
                controlSize="compact"
                value={data.ticket.status}
                disabled={pending}
                onChange={(event) => void status(event.target.value)}
              >
                {["open", ...(data.staff ? ["pending"] : []), "closed"].map(
                  (value) => (
                    <option key={value} value={value}>
                      {statusName(value)}
                    </option>
                  ),
                )}
                {!data.staff && data.ticket.status === "pending" && (
                  <option value="pending" disabled>
                    {statusName("pending")}
                  </option>
                )}
              </PanelSelect>
            </label>
            {admin && (
              <Link
                href={`/panel/tickets/${data.ticket.id}/edit`}
                className="text-xs text-slate-500"
              >
                {t("تنظیمات پیشرفته", "Advanced settings")}
              </Link>
            )}
          </div>
        </div>
        {data.staff && role === "student" && (
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <h2 className="text-xs font-bold">
              {t("سوابق آموزشی دانش‌پژوه", "Student learning history")}
            </h2>
            {data.enrollments.length ? (
              <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                {data.enrollments.map((term, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <p className="font-semibold">
                      {fa ? term.titleFa : term.titleEn || term.titleFa}
                    </p>
                    <p className="mt-1 text-slate-500">
                      {formatPanelDate(term.startDate, locale)} —{" "}
                      {formatPanelDate(term.endDate, locale)}
                    </p>
                    <p className="mt-1 text-emerald-600">
                      {term.status === "active"
                        ? t("فعال", "Active")
                        : term.status === "completed"
                          ? t("تکمیل‌شده", "Completed")
                          : t("انصراف", "Withdrawn")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                {t("ثبت‌نام آموزشی ثبت نشده است.", "No enrollment recorded.")}
              </p>
            )}
          </div>
        )}
        {data.staff && data.purchases.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="font-semibold">
              {t("سفارش‌های پرداخت‌شده:", "Paid order items:")}
            </span>
            {data.purchases.map((item, index) => (
              <span
                key={index}
                className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-800"
              >
                {fa ? item.titleFa : item.titleEn || item.titleFa}
              </span>
            ))}
          </div>
        )}
      </header>
      <div
        className={`${messengerBackground} h-[min(540px,60dvh)] min-h-64 space-y-4 overflow-y-auto p-4 sm:p-6`}
        role="log"
        aria-live="polite"
        aria-label={t("گفت‌وگوی تیکت", "Ticket conversation")}
      >
        <div className="flex justify-center gap-3 text-xs text-emerald-700 dark:text-emerald-300">
          {data.messagesHasMore && (
            <button onClick={() => setPage((value) => value + 1)} type="button">
              {t("پیام‌های قدیمی‌تر", "Older messages")}
            </button>
          )}
          {page > 1 && (
            <button onClick={() => setPage((value) => value - 1)} type="button">
              {t("پیام‌های جدیدتر", "Newer messages")}
            </button>
          )}
        </div>
        {data.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            locale={locale}
            onVisible={visible}
          />
        ))}
        <div ref={bottom} />
      </div>
      <footer className="space-y-2 border-t border-slate-200 bg-white p-3 sm:p-4 dark:border-slate-700 dark:bg-slate-950">
        <p className="min-h-4 text-xs text-emerald-600" role="status">
          {data.peerTyping ? t("در حال نوشتن پیام…", "Typing…") : ""}
        </p>
        {data.ticket.status !== "closed" ? (
          <>
            <MessageComposer
              locale={locale}
              body={body}
              onBodyChange={changeBody}
              onSend={send}
              pending={pending || uploading}
              onFile={file}
              attachment={attachment}
              clearAttachment={() => setAttachment("")}
              onBlur={() => void signal({ operation: "typing", typing: false })}
            />
            <FieldError errors={errors.body} />
            <FieldError errors={errors.attachmentUrl} />
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer">
                {t("پیام صوتی", "Voice message")}
              </summary>
              <div className="mt-3">
                <VoiceRecorder locale={locale} onUploaded={setAttachment} />
              </div>
            </details>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900">
            <span>
              {t("این گفت‌وگو بسته شده است.", "This conversation is closed.")}
            </span>
            <button
              type="button"
              className="font-semibold text-emerald-600"
              disabled={pending}
              onClick={() => void status("open")}
            >
              {t("بازگشایی تیکت", "Reopen ticket")}
            </button>
          </div>
        )}
        {data.ticket.status === "closed" && !data.staff && (
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span>{t("امتیاز پاسخ‌گویی", "Rate support")}</span>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                disabled={pending}
                aria-label={`${rating}/5`}
                className={`text-xl ${rating <= (data.ticket.rating ?? 0) ? "text-amber-500" : "text-slate-300"}`}
                onClick={() =>
                  start(async () => {
                    const form = new FormData();
                    form.set("locale", locale);
                    form.set("rating", String(rating));
                    const result = await rateTicket(data.ticket.id, {}, form);
                    if (result.error) toast.error(result.error);
                    else await refresh();
                  })
                }
              >
                ★
              </button>
            ))}
          </div>
        )}
      </footer>
    </section>
  );
}
