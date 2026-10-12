"use server";
import { randomBytes } from "node:crypto";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  products,
  productVariants,
  orders,
  orderItems,
  orderEvents,
  payments,
  terms,
  termEnrollments,
} from "@/lib/db/schema";
import { notifyAdmins, notifyUsers } from "@/lib/notifications/events";
import { orderLabel, orderStages } from "./status";
import { enrollStudent } from "@/lib/terms/enrollment";
import { gatewayRequest, paymentConfigured, tomanToRial } from "./gateway";
import {
  validationError,
  saved,
  denied,
  failed,
  text,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
const cartSchema = z
  .array(
    z.object({
      productId: z.uuid(),
      variantId: z.union([z.uuid(), z.literal("")]),
      quantity: z.number().int().min(1).max(100),
    }),
  )
  .min(1)
  .max(50);
export async function checkout(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      requestKey: z.uuid(),
      address: z.string().trim().min(10).max(2000),
      postalCode: z.string().regex(/^\d{10}$/),
      notes: z.string().max(2000),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("cart")));
  } catch {
    return failed(locale);
  }
  const cart = cartSchema.safeParse(raw);
  if (!cart.success) return validationError(locale, cart.error);
  let id: string;
  try {
    id = await getDatabase().transaction(async (tx) => {
      await tx.execute(
        sql`select id from users where id=${user.id}::uuid for update`,
      );
      const [existing] = await tx
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.userId, user.id),
            eq(orders.requestKey, parsed.data.requestKey),
          ),
        );
      if (existing) return existing.id;
      const merged = new Map<string, (typeof cart.data)[number]>();
      for (const item of cart.data) {
        const key = `${item.productId}:${item.variantId}`;
        const before = merged.get(key);
        merged.set(key, {
          ...item,
          quantity: item.quantity + (before?.quantity ?? 0),
        });
      }
      const lines = [];
      for (const item of [...merged.values()].sort((a, b) =>
        `${a.productId}:${a.variantId}`.localeCompare(
          `${b.productId}:${b.variantId}`,
        ),
      )) {
        const [product] = await tx
          .select()
          .from(products)
          .where(
            and(
              eq(products.id, item.productId),
              eq(products.status, "published"),
            ),
          )
          .for("update");
        if (!product || item.quantity > 100)
          throw new Error("Stock unavailable");
        const variants = await tx
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, item.productId))
          .orderBy(asc(productVariants.id))
          .for("update");
        const variant = variants.find(
          (v) => v.id === item.variantId && v.isActive,
        );
        if (
          (item.variantId && !variant) ||
          (!item.variantId && variants.some((v) => v.isActive))
        )
          throw new Error("Choose a variant");
        if ((variant?.inventory ?? product.inventory) < item.quantity)
          throw new Error("Stock unavailable");
        const price = variant?.price ?? product.price;
        if (price < 0 || !Number.isSafeInteger(price))
          throw new Error("Invalid price");
        if (variant)
          await tx
            .update(productVariants)
            .set({
              inventory: sql`${productVariants.inventory}-${item.quantity}`,
            })
            .where(eq(productVariants.id, variant.id));
        else
          await tx
            .update(products)
            .set({ inventory: sql`${products.inventory}-${item.quantity}` })
            .where(eq(products.id, product.id));
        lines.push({
          productId: product.id,
          variantId: variant?.id ?? null,
          titleFa: product.titleFa + (variant ? ` · ${variant.titleFa}` : ""),
          titleEn:
            (product.titleEn || product.titleFa) +
            (variant ? ` · ${variant.titleEn || variant.titleFa}` : ""),
          quantity: item.quantity,
          unitPriceToman: price,
        });
      }
      const total = lines.reduce(
        (n, l) => n + l.quantity * l.unitPriceToman,
        0,
      );
      tomanToRial(total);
      const [order] = await tx
        .insert(orders)
        .values({
          ...parsed.data,
          userId: user.id,
          code: `CA-${randomBytes(8).toString("hex").toUpperCase()}`,
          totalToman: total,
          paymentStatus: total === 0 ? "paid" : "pending",
          status: total === 0 ? "processing" : "pending",
        })
        .returning();
      await tx
        .insert(orderItems)
        .values(lines.map((l) => ({ ...l, orderId: order.id })));
      await tx
        .insert(orderEvents)
        .values({ orderId: order.id, actorId: user.id, status: order.status });
      await notifyAdmins(tx, {
        titleFa: "سفارش جدید",
        titleEn: "New order",
        bodyFa: `سفارش ${order.code} ثبت شد.`,
        bodyEn: `Order ${order.code} was placed.`,
        href: `/panel/orders/${order.id}`,
      });
      await notifyUsers(tx, [user.id], {
        titleFa: "سفارش شما ثبت شد",
        titleEn: "Order placed",
        bodyFa: `سفارش ${order.code} از بخش سفارش‌ها قابل پیگیری است.`,
        bodyEn: `Track order ${order.code} from your orders page.`,
        href: `/panel/orders/${order.id}`,
      });
      return order.id;
    });
  } catch {
    return {
      error: text(
        locale,
        "ثبت سفارش انجام نشد. موجودی یا قیمت محصولات تغییر کرده است؛ سبد را بررسی کنید.",
        "Could not place the order. Product availability or prices may have changed; review your cart.",
      ),
    };
  }
  revalidatePath("/", "layout");
  redirect(`/panel/orders/${id}?created=1`);
}
export async function purchaseTerm(
  termId: string,
  requestKey: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireRole("student");
  if (
    !z.uuid().safeParse(termId).success ||
    !z.uuid().safeParse(requestKey).success
  )
    return denied(locale);
  const result = await getDatabase().transaction(async (tx) => {
    await tx.execute(
      sql`select id from users where id=${user.id}::uuid for update`,
    );
    const [existing] = await tx
      .select({ id: orders.id })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orders.userId, user.id),
          eq(orderItems.termId, termId),
          eq(orders.status, "pending"),
        ),
      );
    if (existing) return existing;
    const [term] = await tx
      .select()
      .from(terms)
      .where(eq(terms.id, termId))
      .for("update");
    if (!term || term.status !== "enrollment_open") return denied(locale);
    const check = await enrollStudent(
      tx,
      termId,
      user.id,
      null,
      "direct",
      locale,
      true,
    );
    if (check.error) return check;
    const [order] = await tx
      .insert(orders)
      .values({
        userId: user.id,
        requestKey,
        code: `CA-${randomBytes(8).toString("hex").toUpperCase()}`,
        totalToman: term.tuitionToman,
        address: "—",
        postalCode: "0000000000",
        paymentStatus: term.tuitionToman === 0 ? "paid" : "pending",
        status: term.tuitionToman === 0 ? "processing" : "pending",
      })
      .returning({ id: orders.id });
    await tx.insert(orderItems).values({
      orderId: order.id,
      termId,
      quantity: 1,
      unitPriceToman: term.tuitionToman,
      titleFa: term.titleFa,
      titleEn: term.titleEn,
    });
    if (term.tuitionToman === 0) {
      const result = await enrollStudent(
        tx,
        termId,
        user.id,
        null,
        "direct",
        locale,
      );
      if (result.error) throw new Error(result.error);
    }
    await tx
      .insert(orderEvents)
      .values({
        orderId: order.id,
        actorId: user.id,
        status: term.tuitionToman === 0 ? "processing" : "pending",
      });
    await notifyAdmins(tx, {
      titleFa: "سفارش آموزشی جدید",
      titleEn: "New course order",
      bodyFa: `سفارش ثبت‌نام «${term.titleFa}» ثبت شد.`,
      bodyEn: `An enrollment order for “${term.titleEn || term.titleFa}” was placed.`,
      href: `/panel/orders/${order.id}`,
    });
    await notifyUsers(tx, [user.id], {
      titleFa: "سفارش آموزشی ثبت شد",
      titleEn: "Course order placed",
      bodyFa: `سفارش «${term.titleFa}» قابل پیگیری است.`,
      bodyEn: `You can track your order for “${term.titleEn || term.titleFa}”.`,
      href: `/panel/orders/${order.id}`,
    });
    return order;
  });
  if ("error" in result) return result;
  revalidatePath("/panel", "layout");
  redirect(`/panel/orders/${result.id}`);
}
export async function payOrder(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  if (!z.uuid().safeParse(id).success) return denied(locale);
  if (!paymentConfigured())
    return {
      error: text(
        locale,
        "پرداخت آنلاین هنوز توسط آموزشگاه فعال نشده است. سفارش شما ذخیره شده؛ با پشتیبانی هماهنگ کنید.",
        "Online payment has not been enabled by the school yet. Your order is saved; contact support.",
      ),
    };
  let authority: string;
  try {
    authority = await getDatabase().transaction(async (tx) => {
      const [order] = await tx
        .select()
        .from(orders)
        .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
        .for("update");
      if (
        !order ||
        order.status !== "pending" ||
        order.paymentStatus !== "pending"
      )
        throw new Error("Not payable");
      const [existing] = await tx
        .select()
        .from(payments)
        .where(and(eq(payments.orderId, id), eq(payments.status, "pending")));
      if (existing?.authority) return existing.authority;
      const origin = new URL(process.env.SITE_URL!);
      if (!["https:", "http:"].includes(origin.protocol))
        throw new Error("Invalid site URL");
      const response = await gatewayRequest("request", {
        amount: tomanToRial(order.totalToman),
        currency: "IRR",
        callback_url: new URL("/api/payments/callback", origin).href,
        description: `Cactus ${order.code}`,
        metadata: { mobile: user.mobile },
      });
      if (
        response.code !== 100 ||
        !response.authority ||
        !/^A[\w-]{10,99}$/.test(response.authority)
      )
        throw new Error("Gateway rejected request");
      await tx
        .insert(payments)
        .values({ orderId: id, authority: response.authority });
      return response.authority;
    });
  } catch {
    return failed(locale);
  }
  redirect(`https://www.zarinpal.com/pg/StartPay/${authority}`);
}
export async function cancelOrder(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const result = await getDatabase().transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, id),
          user.role === "admin" ? undefined : eq(orders.userId, user.id),
        ),
      )
      .for("update");
    if (
      !order ||
      order.status !== "pending" ||
      order.paymentStatus !== "pending"
    )
      return denied(locale);
    const [payment] = await tx
      .select()
      .from(payments)
      .where(eq(payments.orderId, id));
    if (payment)
      return {
        error: text(
          locale,
          "این سفارش به درگاه ارسال شده است؛ ابتدا وضعیت پرداخت را بررسی کنید.",
          "This order has been sent to the gateway; verify its payment status first.",
        ),
      };
    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id))
      .orderBy(asc(orderItems.productId));
    for (const item of items) {
      if (item.variantId)
        await tx
          .update(productVariants)
          .set({
            inventory: sql`${productVariants.inventory}+${item.quantity}`,
          })
          .where(eq(productVariants.id, item.variantId));
      else if (item.productId)
        await tx
          .update(products)
          .set({ inventory: sql`${products.inventory}+${item.quantity}` })
          .where(eq(products.id, item.productId));
    }
    await tx
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, id));
    await tx
      .insert(orderEvents)
      .values({
        orderId: id,
        actorId: user.id,
        status: "cancelled",
        previousStatus: order.status,
      });
    await notifyUsers(tx, [order.userId], {
      titleFa: "سفارش لغو شد",
      titleEn: "Order cancelled",
      bodyFa: `سفارش ${order.code} لغو شد.`,
      bodyEn: `Order ${order.code} was cancelled.`,
      href: `/panel/orders/${id}`,
    });
    return saved(locale);
  });
  revalidatePath("/", "layout");
  return result;
}
export async function updateOrder(
  id: string,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireRole("admin"),
    locale = form.get("locale") === "en" ? "en" : "fa";
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const parsed = z
    .object({
      status: z.enum(orderStages),
      expectedStatus: z.string().max(20),
      address: z.string().trim().min(1).max(2000),
      postalCode: z.string().regex(/^\d{10}$/),
      trackingCode: z
        .string()
        .trim()
        .max(120)
        .regex(/^[A-Za-z0-9 -]*$/),
      notes: z.string().max(5000),
      changeReason: z.string().trim().max(500),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    const result = await getDatabase().transaction(
      async (tx): Promise<ActionState> => {
        const [order] = await tx
          .select()
          .from(orders)
          .where(eq(orders.id, id))
          .for("update");
        if (!order || order.status === "cancelled") return denied(locale);
        if (order.status !== parsed.data.expectedStatus)
          return {
            error: text(
              locale,
              "این سفارش هم‌زمان تغییر کرده است؛ صفحه را تازه کنید.",
              "This order changed concurrently. Refresh the page.",
            ),
          };
        if (parsed.data.status !== "pending" && order.paymentStatus !== "paid")
          return {
            error: text(
              locale,
              "پیش از پردازش، پرداخت باید تأیید شده باشد.",
              "Payment must be confirmed before fulfillment.",
            ),
            fieldErrors: {
              status: [
                text(
                  locale,
                  "پرداخت هنوز تأیید نشده است.",
                  "Payment is not confirmed.",
                ),
              ],
            },
          };
        const items = await tx
          .select({ termId: orderItems.termId })
          .from(orderItems)
          .where(eq(orderItems.orderId, id));
        const physical = items.some((item) => !item.termId);
        if (!physical && ["packing", "shipped"].includes(parsed.data.status))
          return {
            error: text(
              locale,
              "سفارش آموزشی بسته‌بندی یا ارسال پستی ندارد.",
              "Educational orders do not require packing or postal shipping.",
            ),
          };
        if (
          physical &&
          ["shipped", "delivered"].includes(parsed.data.status) &&
          !parsed.data.trackingCode
        )
          return {
            error: text(
              locale,
              "کد رهگیری پستی را ثبت کنید.",
              "Add a postal tracking number.",
            ),
            fieldErrors: {
              trackingCode: [
                text(
                  locale,
                  "کد رهگیری الزامی است.",
                  "Tracking number is required.",
                ),
              ],
            },
          };
        const stages: string[] = physical
          ? [...orderStages]
          : ["pending", "processing", "delivered"];
        const previous = stages.indexOf(order.status),
          next = stages.indexOf(parsed.data.status);
        if (next > previous + 1)
          return {
            error: text(
              locale,
              "مراحل سفارش را به ترتیب تکمیل کنید.",
              "Complete the order stages in sequence.",
            ),
            fieldErrors: {
              status: [
                text(
                  locale,
                  "مرحله بعدی را انتخاب کنید.",
                  "Select the next stage.",
                ),
              ],
            },
          };
        if (next < previous && !parsed.data.changeReason)
          return {
            error: text(
              locale,
              "برای بازگشت مرحله، دلیل اصلاح را بنویسید.",
              "Provide a reason when moving to an earlier stage.",
            ),
            fieldErrors: {
              changeReason: [
                text(
                  locale,
                  "دلیل اصلاح الزامی است.",
                  "A correction reason is required.",
                ),
              ],
            },
          };
        const {
          expectedStatus: _expected,
          changeReason,
          ...values
        } = parsed.data;
        await tx
          .update(orders)
          .set({ ...values, updatedAt: new Date() })
          .where(eq(orders.id, id));
        if (
          order.status !== values.status ||
          (order.trackingCode || "") !== values.trackingCode
        ) {
          await tx
            .insert(orderEvents)
            .values({
              orderId: id,
              actorId: admin.id,
              status: values.status,
              previousStatus: order.status,
              note: changeReason,
              trackingCode: values.trackingCode || null,
            });
          await notifyUsers(tx, [order.userId], {
            titleFa: "وضعیت سفارش به‌روز شد",
            titleEn: "Order updated",
            bodyFa: `سفارش ${order.code}: ${orderLabel(values.status, "fa")}${values.trackingCode ? `؛ کد رهگیری: ${values.trackingCode}` : ""}`,
            bodyEn: `Order ${order.code}: ${orderLabel(values.status, "en")}${values.trackingCode ? `; tracking: ${values.trackingCode}` : ""}`,
            href: `/panel/orders/${id}`,
          });
        }
        return saved(locale);
      },
    );
    revalidatePath("/panel", "layout");
    return result;
  } catch {
    return failed(locale);
  }
}
export async function deleteOrder(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const result = await getDatabase().transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .for("update");
    if (
      !order ||
      order.status !== "cancelled" ||
      order.paymentStatus === "paid"
    )
      return denied(locale);
    const [payment] = await tx
      .select()
      .from(payments)
      .where(eq(payments.orderId, id));
    if (payment) return denied(locale);
    await tx.delete(orders).where(eq(orders.id, id));
    return saved(locale);
  });
  revalidatePath("/panel", "layout");
  return result;
}
