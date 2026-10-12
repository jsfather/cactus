import Link from "next/link";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  orders,
  orderItems,
  orderEvents,
  users,
  payments,
} from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
} from "@/lib/panel/pagination";
import { userNameSql } from "@/lib/learning/queries";
import { formatPanelDate } from "@/lib/date/panel";
import { text, title } from "@/lib/workflows";
import { getOrderStats } from "@/lib/commerce/analytics";
import { orderLabel, orderStages } from "@/lib/commerce/status";
import {
  payOrder,
  cancelOrder,
  updateOrder,
  deleteOrder,
} from "@/lib/commerce/actions";
import { PanelStatCard, PanelStatGrid } from "@/components/panel/stat-card";
import {
  PanelListControls,
  PanelPagination,
} from "@/components/panel/list-controls";
import {
  PanelPage,
  PanelPageHeader,
  PanelSurface,
  PanelTable,
  PanelTableCell,
  PanelEmptyState,
  primaryButtonClass,
} from "@/components/panel/ui";
import { OrderProgress } from "@/components/orders/order-progress";
import { TrackingCode } from "@/components/orders/tracking-code";
import { ActionForm, ActionButton, DeleteAction } from "./action-form";
import { CompleteCart } from "./cart";

export async function OrdersPage({
  id,
  query = "",
  status = "",
  created = false,
  page = 1,
}: {
  id?: string;
  query?: string;
  status?: string;
  created?: boolean;
  page?: number;
}) {
  const user = await requireUser(),
    locale = await getPanelLocale(),
    admin = user.role === "admin",
    db = getDatabase(),
    fa = locale === "fa";
  const paymentLabel = (value: string) =>
    value === "pending"
      ? fa
        ? "در انتظار پرداخت"
        : "Awaiting payment"
      : orderLabel(value, locale);
  const label = (value: string) => orderLabel(value, locale),
    number = (value: number) => value.toLocaleString(locale);
  if (id) {
    if (!z.uuid().safeParse(id).success) notFound();
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.id, id), admin ? undefined : eq(orders.userId, user.id)),
      );
    if (!order) notFound();
    const [items, transactions, events] = await Promise.all([
      db.select().from(orderItems).where(eq(orderItems.orderId, id)),
      db
        .select({
          id: payments.id,
          reference: payments.reference,
          status: payments.status,
        })
        .from(payments)
        .where(eq(payments.orderId, id)),
      db
        .select()
        .from(orderEvents)
        .where(eq(orderEvents.orderId, id))
        .orderBy(asc(orderEvents.createdAt), asc(orderEvents.id)),
    ]);
    const physical = items.some((item) => !item.termId);
    return (
      <PanelPage>
        {created && order.userId === user.id && (
          <CompleteCart orderId={order.id} items={items} />
        )}
        <PanelPageHeader
          eyebrow={fa ? "پیگیری سفارش" : "Order tracking"}
          title={
            <span dir="ltr" className="nums-en">
              {order.code}
            </span>
          }
          description={`${formatPanelDate(order.createdAt, locale, true)} · ${fa ? "پرداخت" : "Payment"}: ${paymentLabel(order.paymentStatus)}`}
          actions={
            <Link href="/panel/orders" className={primaryButtonClass}>
              {fa ? "همه سفارش‌ها" : "All orders"}
            </Link>
          }
        />
        <OrderProgress
          status={order.status}
          paymentStatus={order.paymentStatus}
          physical={physical}
          locale={locale}
          events={[
            {
              id: "placed",
              status: "pending",
              createdAt: order.createdAt,
              trackingCode: null,
            },
            ...events,
          ]}
        />
        {physical &&
          order.trackingCode &&
          ["shipped", "delivered"].includes(order.status) && (
            <TrackingCode code={order.trackingCode} locale={locale} />
          )}
        <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <PanelSurface>
            <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
              <h2 className="font-bold">
                {fa ? "اقلام سفارش" : "Order items"}
              </h2>
            </div>
            <PanelTable
              columns={[
                {
                  label: fa ? "شرح کالا / دوره" : "Product / course",
                  className: "w-[55%]",
                },
                { label: fa ? "تعداد" : "Quantity", className: "w-[15%]" },
                {
                  label: fa ? "مبلغ (تومان)" : "Amount (toman)",
                  className: "w-[30%]",
                },
              ]}
            >
              {items.map((item) => (
                <tr key={item.id}>
                  <PanelTableCell>{title(item, locale)}</PanelTableCell>
                  <PanelTableCell>{number(item.quantity)}</PanelTableCell>
                  <PanelTableCell>
                    {number(item.quantity * item.unitPriceToman)}
                  </PanelTableCell>
                </tr>
              ))}
            </PanelTable>
          </PanelSurface>
          <PanelSurface className="space-y-4 p-5">
            <h2 className="font-bold">
              {fa ? "خلاصه سفارش" : "Order summary"}
            </h2>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {number(order.totalToman)}{" "}
              <span className="text-sm">{fa ? "تومان" : "toman"}</span>
            </p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-zinc-500">
                  {fa ? "وضعیت پرداخت" : "Payment status"}
                </dt>
                <dd className="mt-1 font-semibold">
                  {paymentLabel(order.paymentStatus)}
                </dd>
              </div>
              {physical && (
                <>
                  <div>
                    <dt className="text-zinc-500">
                      {fa ? "نشانی تحویل" : "Delivery address"}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap leading-7">
                      {order.address}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">
                      {fa ? "کد پستی" : "Postal code"}
                    </dt>
                    <dd dir="ltr" className="nums-en mt-1">
                      {order.postalCode}
                    </dd>
                  </div>
                </>
              )}
              {order.notes && (
                <div>
                  <dt className="text-zinc-500">{fa ? "توضیحات" : "Notes"}</dt>
                  <dd className="mt-1 whitespace-pre-wrap">{order.notes}</dd>
                </div>
              )}
              {transactions
                .filter((t) => t.reference)
                .map((t) => (
                  <div key={t.id}>
                    <dt className="text-zinc-500">
                      {fa ? "شماره پیگیری پرداخت" : "Payment reference"}
                    </dt>
                    <dd className="nums-en mt-1 break-all" dir="ltr">
                      {t.reference}
                    </dd>
                  </div>
                ))}
            </dl>
          </PanelSurface>
        </div>
        {order.status === "pending" && order.paymentStatus === "pending" && (
          <div className="flex flex-wrap gap-3">
            {order.userId === user.id && (
              <ActionButton
                locale={locale}
                action={payOrder.bind(null, id, locale)}
                label={fa ? "پرداخت آنلاین" : "Pay online"}
              />
            )}
            <ActionButton
              locale={locale}
              action={cancelOrder.bind(null, id, locale)}
              label={fa ? "لغو سفارش" : "Cancel order"}
              confirmation={
                fa
                  ? "سفارش لغو می‌شود و موجودی رزروشده بازگردانده خواهد شد."
                  : "The order will be cancelled and reserved stock restored."
              }
            />
            <Link href="/panel/tickets/new" className={primaryButtonClass}>
              {fa ? "تماس با پشتیبانی" : "Contact support"}
            </Link>
          </div>
        )}
        {order.paymentStatus === "paid" &&
          items.some((i) => i.termId) &&
          user.role === "student" && (
            <Link href="/panel/student/terms" className={primaryButtonClass}>
              {fa ? "مشاهده کلاس‌ها" : "View classes"}
            </Link>
          )}
        {admin && order.status !== "cancelled" && (
          <ActionForm
            locale={locale}
            action={updateOrder.bind(null, id)}
            heading={fa ? "مدیریت گردش سفارش" : "Manage fulfillment"}
            initial={{
              status: order.status,
              address: order.address,
              postalCode: order.postalCode,
              trackingCode: order.trackingCode || "",
              notes: order.notes || "",
              changeReason: "",
            }}
            fields={[
              {
                name: "status",
                label: fa ? "مرحله سفارش" : "Order stage",
                options: (physical
                  ? [...orderStages]
                  : ["pending", "processing", "delivered"]
                ).map((value) => ({ value, label: label(value) })),
              },
              {
                name: "trackingCode",
                label: fa ? "کد رهگیری پستی" : "Postal tracking number",
                dir: "ltr",
                hint: fa
                  ? "برای مرحله ارسال و تحویل کالا الزامی است."
                  : "Required when shipping or delivering physical goods.",
              },
              {
                name: "address",
                label: fa ? "نشانی تحویل" : "Delivery address",
                type: "textarea",
                required: true,
              },
              {
                name: "postalCode",
                label: fa ? "کد پستی" : "Postal code",
                dir: "ltr",
                required: true,
              },
              {
                name: "notes",
                label: fa
                  ? "توضیحات قابل مشاهده مشتری"
                  : "Customer-visible notes",
                type: "textarea",
              },
              {
                name: "changeReason",
                label: fa
                  ? "دلیل اصلاح مرحله (برای بازگشت الزامی)"
                  : "Correction reason (required for rollback)",
                type: "textarea",
              },
            ]}
          >
            <input type="hidden" name="expectedStatus" value={order.status} />
          </ActionForm>
        )}
        {admin && events.length > 0 && (
          <PanelSurface className="p-5">
            <h2 className="mb-4 font-bold">
              {fa ? "تاریخچه تغییرات سفارش" : "Fulfillment history"}
            </h2>
            <ol className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="border-s-2 border-emerald-200 ps-4 text-sm dark:border-emerald-800"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-semibold">{label(event.status)}</span>
                    <time
                      className="text-xs text-zinc-500"
                      dateTime={event.createdAt.toISOString()}
                    >
                      {formatPanelDate(event.createdAt, locale, true)}
                    </time>
                  </div>
                  {event.note && (
                    <p className="mt-1 text-zinc-500">{event.note}</p>
                  )}
                  {event.trackingCode && (
                    <p dir="ltr" className="nums-en mt-1 break-all">
                      {event.trackingCode}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </PanelSurface>
        )}
        {admin && order.status === "cancelled" && (
          <DeleteAction
            locale={locale}
            action={deleteOrder.bind(null, id, locale)}
          />
        )}
      </PanelPage>
    );
  }
  const q = query.trim().slice(0, 100),
    validStatus = [...orderStages, "cancelled", "awaiting", "active"].includes(
      status,
    )
      ? status
      : "";
  const scope = admin ? undefined : eq(orders.userId, user.id);
  const filter = and(
    scope,
    q ? ilike(orders.code, `%${escapeLikePattern(q)}%`) : undefined,
    validStatus === "awaiting"
      ? and(
          eq(orders.paymentStatus, "pending"),
          sql`${orders.status}<>'cancelled'`,
        )
      : validStatus === "active"
        ? sql`${orders.status} in ('processing','packing')`
        : validStatus
          ? eq(orders.status, validStatus)
          : undefined,
  );
  const [stats, [{ total }]] = await Promise.all([
    getOrderStats(admin ? undefined : user.id),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(orders)
      .where(filter),
  ]);
  const normalized = normalizePage(
    Number.isSafeInteger(page) && page > 0 ? page : 1,
    total,
  );
  const items = await db
    .select({ order: orders, name: userNameSql(locale) })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .where(filter)
    .orderBy(desc(orders.createdAt), desc(orders.id))
    .limit(ADMIN_PAGE_SIZE)
    .offset((normalized.page - 1) * ADMIN_PAGE_SIZE);
  const cards = [
    ["", fa ? "کل سفارش‌ها" : "All orders", stats.total, "emerald"],
    [
      "awaiting",
      fa ? "در انتظار پرداخت" : "Awaiting payment",
      stats.awaiting,
      "amber",
    ],
    ["active", fa ? "در حال انجام" : "In progress", stats.active, "violet"],
    ["shipped", fa ? "ارسال‌شده" : "Shipped", stats.shipped, "sky"],
    ["delivered", fa ? "تحویل‌شده" : "Delivered", stats.delivered, "emerald"],
    ["cancelled", fa ? "لغوشده" : "Cancelled", stats.cancelled, "rose"],
  ] as const;
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={fa ? "فروشگاه و پرداخت" : "Commerce & payments"}
        title={fa ? "سفارش‌ها" : "Orders"}
        description={
          fa
            ? "آمار کلی و پیگیری مرحله‌به‌مرحله سفارش‌ها؛ کارت‌ها برای فیلتر فهرست قابل انتخاب هستند."
            : "Order overview and step-by-step fulfillment. Select a card to filter the list."
        }
      />
      <PanelStatGrid>
        {cards.map(([key, name, value, tone]) => (
          <PanelStatCard
            key={key}
            label={name}
            value={number(value)}
            tone={tone}
            icon={key === "awaiting" ? "clock" : "box"}
            href={`/panel/orders${key ? `?status=${key}` : ""}`}
          />
        ))}
      </PanelStatGrid>
      <PanelSurface>
        <PanelListControls
          action="/panel/orders"
          locale={locale}
          query={q}
          searchPlaceholder={fa ? "کد سفارش…" : "Order code…"}
          filters={[
            {
              name: "status",
              label: fa ? "مرحله" : "Stage",
              value: validStatus,
              options: [
                { value: "", label: fa ? "همه مراحل" : "All stages" },
                ...orderStages.map((value) => ({ value, label: label(value) })),
                { value: "cancelled", label: label("cancelled") },
                {
                  value: "awaiting",
                  label: fa ? "در انتظار پرداخت" : "Awaiting payment",
                },
                { value: "active", label: fa ? "در حال انجام" : "In progress" },
              ],
            },
          ]}
        />
        {items.length ? (
          <PanelTable
            columns={[
              { label: fa ? "سفارش" : "Order", className: "w-[32%]" },
              { label: fa ? "مرحله" : "Stage", className: "w-[25%]" },
              {
                label: fa ? "مبلغ (تومان)" : "Amount (toman)",
                className: "w-[23%]",
              },
              { label: fa ? "تاریخ ثبت" : "Placed on", className: "w-[20%]" },
            ]}
          >
            {items.map(({ order: o, name }) => (
              <tr key={o.id}>
                <PanelTableCell>
                  <Link
                    href={`/panel/orders/${o.id}`}
                    className="nums-en font-semibold text-emerald-700 dark:text-emerald-300"
                    dir="ltr"
                  >
                    {o.code}
                  </Link>
                  {admin && (
                    <p className="mt-1 text-xs text-zinc-500">{name}</p>
                  )}
                </PanelTableCell>
                <PanelTableCell>
                  <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold dark:bg-zinc-800">
                    {label(o.status)}
                  </span>
                  <p className="mt-2 text-xs text-zinc-500">
                    {paymentLabel(o.paymentStatus)}
                  </p>
                </PanelTableCell>
                <PanelTableCell>{number(o.totalToman)}</PanelTableCell>
                <PanelTableCell>
                  {formatPanelDate(o.createdAt, locale)}
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={fa ? "سفارشی پیدا نشد" : "No orders found"}
            description={
              fa
                ? "فیلترها را تغییر دهید یا سفارش جدید ثبت کنید."
                : "Change the filters or place a new order."
            }
          />
        )}
        <PanelPagination
          action="/panel/orders"
          locale={locale}
          pagination={{ ...normalized, total, pageSize: ADMIN_PAGE_SIZE }}
          query={{
            ...(q ? { q } : {}),
            ...(validStatus ? { status: validStatus } : {}),
          }}
        />
      </PanelSurface>
    </PanelPage>
  );
}
