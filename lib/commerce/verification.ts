import { eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { orders, orderItems, payments, notifications } from "@/lib/db/schema";
import { gatewayRequest, tomanToRial } from "./gateway";
import { enrollStudent } from "@/lib/terms/enrollment";
export async function verifyPayment(authority: string) {
  const db = getDatabase();
  const [payment] = await db
    .select({ payment: payments, order: orders })
    .from(payments)
    .innerJoin(orders, eq(orders.id, payments.orderId))
    .where(eq(payments.authority, authority));
  if (!payment) return null;
  if (payment.payment.status === "paid") return payment.order.id;
  // Callback query parameters never establish payment; only server verification does.
  const result = await gatewayRequest("verify", {
    authority,
    amount: tomanToRial(payment.order.totalToman),
  });
  if (![100, 101].includes(result.code) || !result.ref_id)
    return payment.order.id;
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
      .set({ status: "paid", reference: String(result.ref_id) })
      .where(eq(payments.id, record.id));
    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    let review = false;
    for (const item of items) {
      if (item.termId) {
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
    await tx
      .insert(notifications)
      .values({
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
  return payment.order.id;
}
