import { eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  orders,
  orderItems,
  payments,
  notifications,
  orderEvents,
} from "@/lib/db/schema";
import { notifyAdmins } from "@/lib/notifications/events";
import { gatewayRequest, tomanToRial, GatewayRejection } from "./gateway";
import { enrollStudent } from "@/lib/terms/enrollment";
export type PaymentResult = { orderId: string; status: "paid" | "failed" | "pending" };
export async function verifyPayment(authority: string): Promise<PaymentResult | null> {
  const db = getDatabase();
  const [payment] = await db
    .select({ payment: payments, order: orders })
    .from(payments)
    .innerJoin(orders, eq(orders.id, payments.orderId))
    .where(eq(payments.authority, authority));
  if (!payment) return null;
  if (payment.payment.status === "paid") return { orderId: payment.order.id, status: "paid" };
  // Callback query parameters never establish payment; only server verification does.
  let result;
  try {
    result = await gatewayRequest("verify", { authority, amount: tomanToRial(payment.payment.amountToman ?? payment.order.totalToman) });
  } catch (error) {
    // Only a definitive unsuccessful attempt permits another payment. Network
    // and merchant/configuration failures remain pending for reconciliation.
    const terminal = error instanceof GatewayRejection && error.code === -51;
    return db.transaction(async (tx) => {
      const [order] = await tx.select().from(orders).where(eq(orders.id, payment.order.id)).for("update");
      const [record] = await tx.select().from(payments).where(eq(payments.id, payment.payment.id)).for("update");
      if (record.status === "paid" || order.paymentStatus === "paid") return { orderId: order.id, status: "paid" as const };
      await tx.update(payments).set({ status: terminal ? "failed" : record.status, gatewayCode: error instanceof GatewayRejection ? error.code : null, checkedAt: new Date() }).where(eq(payments.id, record.id));
      return { orderId: order.id, status: terminal ? "failed" as const : "pending" as const };
    });
  }
  if (![100, 101].includes(result.code) || !result.ref_id || String(result.ref_id) === "0") return { orderId: payment.order.id, status: "pending" };
  await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, payment.order.id))
      .for("update");
    const [record] = await tx
      .select()
      .from(payments)
      .where(eq(payments.id, payment.payment.id))
      .for("update");
    if (record.status === "paid") return;
    await tx
      .update(payments)
      .set({ status: "paid", reference: String(result.ref_id), gatewayCode: result.code, checkedAt: new Date(), verifiedAt: new Date() })
      .where(eq(payments.id, record.id));
    // A second verified payment must not rewind an already fulfilled order.
    if (order.paymentStatus === "paid") {
      await notifyAdmins(tx, { titleFa: "نیاز به بررسی پرداخت تکراری", titleEn: "Duplicate payment needs review", bodyFa: `برای سفارش ${order.code} پرداخت دیگری تأیید شده است؛ بازپرداخت را بررسی کنید.`, bodyEn: `An additional payment was confirmed for ${order.code}. Review for refund.`, href: `/panel/orders/${order.id}` });
      return;
    }
    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    let review = order.status === "cancelled";
    for (const item of items) {
      if (item.termId && order.status !== "cancelled") {
        const enrolled = await enrollStudent(
          tx,
          item.termId,
          order.userId,
          null,
          "direct",
          "fa",
        );
        if (enrolled.error) review = true;
      }
    }
    await tx
      .update(orders)
      .set({
        paymentStatus: "paid",
        status: review ? "pending" : "processing",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));
    if (order.status !== (review ? "pending" : "processing"))
      await tx
        .insert(orderEvents)
        .values({
          orderId: order.id,
          status: review ? "pending" : "processing",
          previousStatus: order.status,
          note: "Payment verified",
        });
    await notifyAdmins(tx, {
      titleFa: "پرداخت سفارش تأیید شد",
      titleEn: "Order payment confirmed",
      bodyFa: `پرداخت سفارش ${order.code} تأیید شد.`,
      bodyEn: `Payment for order ${order.code} was confirmed.`,
      href: `/panel/orders/${order.id}`,
    });
    await tx.insert(notifications).values({
      userId: order.userId,
      titleFa: "پرداخت تأیید شد",
      titleEn: "Payment confirmed",
      bodyFa: review
        ? "پرداخت دریافت شد. برای نهایی‌سازی ثبت‌نام با پشتیبانی تماس بگیرید."
        : "سفارش شما در حال پردازش است.",
      bodyEn: review
        ? "Payment received. Contact support to finalize enrollment."
        : "Your order is being processed.",
      href: `/panel/orders/${order.id}`,
    });
  });
  return { orderId: payment.order.id, status: "paid" };
}
