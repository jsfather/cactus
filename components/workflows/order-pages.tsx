import { CompleteCart } from "./cart";
import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { orders, orderItems, users, payments } from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { escapeLikePattern } from "@/lib/panel/pagination";
import { userNameSql } from "@/lib/learning/queries";
import { text, title } from "@/lib/workflows";
import {
  payOrder,
  cancelOrder,
  updateOrder,
  deleteOrder,
} from "@/lib/commerce/actions";
import { ActionForm, ActionButton, DeleteAction } from "./action-form";
import { PanelInput, PanelSelect } from "@/components/panel/form-controls";
import {
  PanelPage,
  PanelPageHeader,
  PanelSurface,
  PanelTable,
  PanelTableCell,
  PanelEmptyState,
  primaryButtonClass,
} from "@/components/panel/ui";
export async function OrdersPage({
  id,
  query = "",
  status = "",
  created = false,
}: {
  id?: string;
  query?: string;
  status?: string;
  created?: boolean;
}) {
  const user = await requireUser();
  const locale = await getPanelLocale();
  const admin = user.role === "admin";
  const db = getDatabase();
  const statusLabel = (s: string) =>
    text(
      locale,
      (
        {
          pending: "در انتظار",
          processing: "در حال پردازش",
          shipped: "ارسال شده",
          delivered: "تحویل شده",
          cancelled: "لغوشده",
          paid: "پرداخت‌شده",
          failed: "ناموفق",
          refunded: "بازپرداخت‌شده",
        } as Record<string, string>
      )[s] ?? s,
      s,
    );
  if (id) {
    if (!z.uuid().safeParse(id).success) notFound();
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.id, id), admin ? undefined : eq(orders.userId, user.id)),
      );
    if (!order) notFound();
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    const transactions = await db
      .select({ reference: payments.reference, status: payments.status })
      .from(payments)
      .where(eq(payments.orderId, id));
    return (
      <PanelPage>
        {created && order.userId === user.id && <CompleteCart orderId={order.id} items={items} />}
        <PanelPageHeader
          eyebrow={text(locale, "سفارش", "Order")}
          title={order.code}
          description={`${statusLabel(order.status)} · ${text(locale, "پرداخت", "Payment")}: ${statusLabel(order.paymentStatus)}`}
        />
        <PanelSurface>
          <PanelTable
            columns={[
              { label: text(locale, "شرح", "Item"), className: "w-[55%]" },
              {
                label: text(locale, "تعداد", "Quantity"),
                className: "w-[15%]",
              },
              { label: text(locale, "مبلغ", "Amount"), className: "w-[30%]" },
            ]}
          >
            {items.map((i) => (
              <tr key={i.id}>
                <PanelTableCell>{title(i, locale)}</PanelTableCell>
                <PanelTableCell>{i.quantity}</PanelTableCell>
                <PanelTableCell>
                  {(i.unitPriceToman * i.quantity).toLocaleString(locale)}
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
          <div className="space-y-3 border-t border-zinc-200 p-6 dark:border-zinc-800">
            <p className="text-xl font-bold">
              {order.totalToman.toLocaleString(locale)}{" "}
              {text(locale, "تومان", "toman")}
            </p>
            <p className="whitespace-pre-wrap">
              {order.address} · {order.postalCode}
            </p>
            {order.trackingCode && (
              <p>
                {text(locale, "کد رهگیری", "Tracking code")}:{" "}
                {order.trackingCode}
              </p>
            )}
            {order.notes && <p>{order.notes}</p>}
            {transactions
              .filter((t) => t.reference)
              .map((t) => (
                <p key={t.reference}>
                  {text(locale, "شماره پیگیری پرداخت", "Payment reference")}:{" "}
                  {t.reference}
                </p>
              ))}
          </div>
        </PanelSurface>
        {order.status === "pending" && order.paymentStatus === "pending" && (
          <div className="flex flex-wrap gap-4">
            {order.userId === user.id && (
              <ActionButton
                locale={locale}
                action={payOrder.bind(null, id, locale)}
                label={text(locale, "پرداخت آنلاین", "Pay online")}
              />
            )}
            <ActionButton
              locale={locale}
              action={cancelOrder.bind(null, id, locale)}
              label={text(locale, "لغو سفارش", "Cancel order")}
            />
            <Link href="/panel/tickets/new" className={primaryButtonClass}>
              {text(locale, "تماس با پشتیبانی", "Contact support")}
            </Link>
          </div>
        )}
        {order.paymentStatus === "paid" && items.some((i) => i.termId) && (
          <Link className={primaryButtonClass} href="/panel/student/terms">
            {text(locale, "رفتن به کلاس‌ها", "Go to classes")}
          </Link>
        )}
        {admin && (
          <ActionForm
            locale={locale}
            action={updateOrder.bind(null, id)}
            initial={Object.fromEntries(
              Object.entries(order).map(([k, v]) => [k, String(v ?? "")]),
            )}
            fields={[
              {
                name: "status",
                label: text(locale, "وضعیت سفارش", "Order status"),
                options: ["pending", "processing", "shipped", "delivered"].map(
                  (v) => ({ value: v, label: statusLabel(v) }),
                ),
              },
              {
                name: "address",
                label: text(locale, "نشانی", "Address"),
                type: "textarea",
                required: true,
              },
              {
                name: "postalCode",
                label: text(locale, "کد پستی", "Postal code"),
                required: true,
              },
              {
                name: "trackingCode",
                label: text(
                  locale,
                  "کد رهگیری ارسال",
                  "Shipment tracking code",
                ),
              },
              {
                name: "notes",
                label: text(locale, "توضیحات", "Notes"),
                type: "textarea",
              },
            ]}
          />
        )}{" "}
        {admin && order.status === "cancelled" && (
          <DeleteAction
            locale={locale}
            action={deleteOrder.bind(null, id, locale)}
          />
        )}
      </PanelPage>
    );
  }
  const q = query.trim().slice(0, 100);
  const items = await db
    .select({ order: orders, name: userNameSql(locale) })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .where(
      and(
        admin ? undefined : eq(orders.userId, user.id),
        q ? ilike(orders.code, `%${escapeLikePattern(q)}%`) : undefined,
        status ? eq(orders.status, status) : undefined,
      ),
    )
    .orderBy(desc(orders.createdAt));
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "فروشگاه", "Commerce")}
        title={text(locale, "سفارش‌ها", "Orders")}
        description={text(
          locale,
          "پیگیری سفارش و وضعیت پرداخت",
          "Track orders and payment status",
        )}
      />
      <form className="flex flex-wrap gap-3">
        <PanelInput
          name="q"
          defaultValue={query}
          placeholder={text(locale, "کد سفارش", "Order code")}
          aria-label={text(locale, "کد سفارش", "Order code")}
        />
        <PanelSelect
          name="status"
          defaultValue={status}
          aria-label={text(locale, "وضعیت", "Status")}
        >
          <option value="">
            {text(locale, "همه وضعیت‌ها", "All statuses")}
          </option>
          {["pending", "processing", "shipped", "delivered", "cancelled"].map(
            (s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ),
          )}
        </PanelSelect>
        <button className={primaryButtonClass}>
          {text(locale, "جست‌وجو", "Search")}
        </button>
      </form>
      <PanelSurface>
        {items.length ? (
          <PanelTable
            columns={[
              { label: text(locale, "سفارش", "Order"), className: "w-[40%]" },
              { label: text(locale, "وضعیت", "Status"), className: "w-[30%]" },
              { label: text(locale, "مبلغ", "Amount"), className: "w-[30%]" },
            ]}
          >
            {items.map(({ order: o, name }) => (
              <tr key={o.id}>
                <PanelTableCell>
                  <Link
                    className="font-semibold"
                    href={`/panel/orders/${o.id}`}
                  >
                    {o.code}
                  </Link>
                  {admin && <p className="text-xs text-zinc-500">{name}</p>}
                </PanelTableCell>
                <PanelTableCell>
                  {statusLabel(o.status)} · {statusLabel(o.paymentStatus)}
                </PanelTableCell>
                <PanelTableCell>
                  {o.totalToman.toLocaleString(locale)}{" "}
                  {text(locale, "تومان", "toman")}
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={text(locale, "سفارشی پیدا نشد", "No orders found")}
            description=""
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
