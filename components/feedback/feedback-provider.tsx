"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n/config";

export type ToastVariant = "success" | "error" | "warning" | "info";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastItem = Required<Pick<ToastOptions, "title" | "variant">> &
  Pick<ToastOptions, "description"> & { id: string };

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
};

type PendingConfirm = ConfirmOptions & {
  id: string;
  resolve: (answer: boolean) => void;
};

type FeedbackContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  toast: {
    show: (options: ToastOptions) => string;
    success: (title: string, description?: string) => string;
    error: (title: string, description?: string) => string;
    warning: (title: string, description?: string) => string;
    info: (title: string, description?: string) => string;
    dismiss: (id: string) => void;
  };
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const path = variant === "success"
    ? "m7 12 3 3 7-7"
    : variant === "error"
      ? "m8 8 8 8M16 8l-8 8"
      : variant === "warning"
        ? "M12 8v5m0 3h.01"
        : "M12 11v5m0-8h.01";

  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-current/10">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {variant === "warning" ? <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 4.4 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.4a2 2 0 0 0-3.4 0Z" /> : <circle cx="12" cy="12" r="9" />}
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </span>
  );
}

export function AppFeedbackProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [request, setRequest] = useState<PendingConfirm | null>(null);
  const requestRef = useRef<PendingConfirm | null>(null);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const show = useCallback((options: ToastOptions) => {
    const id = crypto.randomUUID();
    const item: ToastItem = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? "info",
    };
    setToasts((current) => [...current.slice(-3), item]);
    timers.current.set(id, setTimeout(() => dismiss(id), options.duration ?? 5000));
    return id;
  }, [dismiss]);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => {
    requestRef.current?.resolve(false);
    const nextRequest: PendingConfirm = { ...options, id: crypto.randomUUID(), resolve };
    requestRef.current = nextRequest;
    setRequest(nextRequest);
  }), []);

  const closeConfirm = useCallback((answer: boolean) => {
    const current = requestRef.current;
    if (!current) return;
    requestRef.current = null;
    setRequest(null);
    current.resolve(answer);
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      for (const timer of activeTimers.values()) clearTimeout(timer);
      requestRef.current?.resolve(false);
    };
  }, []);

  useEffect(() => {
    if (!request) return;
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeConfirm(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      activeElement?.focus();
    };
  }, [closeConfirm, request]);

  const value = useMemo<FeedbackContextValue>(() => ({
    confirm,
    toast: {
      show,
      success: (title, description) => show({ title, description, variant: "success" }),
      error: (title, description) => show({ title, description, variant: "error", duration: 7000 }),
      warning: (title, description) => show({ title, description, variant: "warning" }),
      info: (title, description) => show({ title, description, variant: "info" }),
      dismiss,
    },
  }), [confirm, dismiss, show]);

  const labels = locale === "fa"
    ? { cancel: "انصراف", confirm: "تأیید", close: "بستن پیام" }
    : { cancel: "Cancel", confirm: "Confirm", close: "Dismiss notification" };
  const toastStyles: Record<ToastVariant, string> = {
    success: "border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300",
    error: "border-red-200 text-red-700 dark:border-red-900 dark:text-red-300",
    warning: "border-amber-200 text-amber-700 dark:border-amber-900 dark:text-amber-300",
    info: "border-sky-200 text-sky-700 dark:border-sky-900 dark:text-sky-300",
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <section aria-label={locale === "fa" ? "پیام‌ها" : "Notifications"} aria-live="polite" aria-relevant="additions" className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-3 sm:inset-x-auto sm:end-5 sm:w-[min(24rem,calc(100vw-2.5rem))]">
        {toasts.map((item) => (
          <article key={item.id} role={item.variant === "error" ? "alert" : "status"} className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl shadow-zinc-950/15 animate-[cactus-toast-in_180ms_ease-out] dark:bg-zinc-900 ${toastStyles[item.variant]}`}>
            <ToastIcon variant={item.variant} />
            <div className="min-w-0 flex-1 text-start">
              <p className="font-semibold text-zinc-950 dark:text-zinc-50">{item.title}</p>
              {item.description ? <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.description}</p> : null}
            </div>
            <button type="button" aria-label={labels.close} onClick={() => dismiss(item.id)} className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">×</button>
          </article>
        ))}
      </section>

      {request ? (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-zinc-950/55 p-4 backdrop-blur-sm animate-[cactus-fade-in_150ms_ease-out]" onMouseDown={(event) => { if (event.target === event.currentTarget) closeConfirm(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby={`confirm-title-${request.id}`} aria-describedby={request.description ? `confirm-description-${request.id}` : undefined} className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 text-start shadow-2xl shadow-black/25 animate-[cactus-dialog-in_180ms_ease-out] dark:border-zinc-700 dark:bg-zinc-900">
            <div className={`grid size-12 place-items-center rounded-2xl ${request.variant === "primary" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 3h.01M10.3 4.4 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.4a2 2 0 0 0-3.4 0Z" /></svg>
            </div>
            <h2 id={`confirm-title-${request.id}`} className="mt-5 text-xl font-bold text-zinc-950 dark:text-zinc-50">{request.title}</h2>
            {request.description ? <p id={`confirm-description-${request.id}`} className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">{request.description}</p> : null}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button ref={cancelButtonRef} type="button" onClick={() => closeConfirm(false)} className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{request.cancelLabel ?? labels.cancel}</button>
              <button type="button" onClick={() => closeConfirm(true)} className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${request.variant === "primary" ? "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950" : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-red-950"}`}>{request.confirmLabel ?? labels.confirm}</button>
            </div>
          </section>
        </div>
      ) : null}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback must be used inside AppFeedbackProvider.");
  return context;
}
