import type { Locale } from "@/lib/i18n/config";
import { formatPanelDate } from "@/lib/date/panel";
import { orderLabel, orderStages } from "@/lib/commerce/status";
import { PanelSurface } from "@/components/panel/ui";
export function OrderProgress({
  status,
  paymentStatus,
  physical,
  locale,
  events,
}: {
  status: string;
  paymentStatus: string;
  physical: boolean;
  locale: Locale;
  events: {
    id: string;
    status: string;
    createdAt: Date;
    trackingCode: string | null;
  }[];
}) {
  const fa = locale === "fa",
    stages = physical
      ? [...orderStages]
      : ["pending", "processing", "delivered"],
    current = stages.indexOf(status);
  return (
    <PanelSurface className="p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">
          {fa ? "مسیر سفارش شما" : "Your order journey"}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "cancelled" ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}
        >
          {status === "cancelled"
            ? orderLabel(status, locale)
            : paymentStatus !== "paid"
              ? fa
                ? "در انتظار پرداخت"
                : "Awaiting payment"
              : orderLabel(status, locale)}
        </span>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3 xl:flex">
        {stages.map((stage, index) => {
          const reached = status !== "cancelled" && current >= index,
            active = stage === status,
            event = events.filter((item) => item.status === stage).at(-1);
          return (
            <li
              key={stage}
              aria-current={active ? "step" : undefined}
              className={`flex min-w-0 flex-1 items-start gap-3 rounded-2xl border p-4 ${active ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-700 dark:bg-emerald-950/40" : "border-zinc-200 dark:border-zinc-800"}`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${reached ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"}`}
              >
                {reached && !active ? "✓" : (index + 1).toLocaleString(locale)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {!physical && stage === "delivered"
                    ? fa
                      ? "تکمیل خدمت"
                      : "Service completed"
                    : orderLabel(stage, locale)}
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {event
                    ? formatPanelDate(event.createdAt, locale, true)
                    : active
                      ? fa
                        ? "مرحله فعلی"
                        : "Current stage"
                      : reached
                        ? fa
                          ? "تکمیل‌شده؛ تاریخ ثبت نشده"
                          : "Completed; date unavailable"
                        : fa
                          ? "در انتظار"
                          : "Upcoming"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      {!physical && (
        <p className="mt-4 text-xs leading-6 text-zinc-500">
          {fa
            ? "این سفارش آموزشی است و ارسال پستی ندارد."
            : "This is an educational order and does not require postal shipping."}
        </p>
      )}
    </PanelSurface>
  );
}
