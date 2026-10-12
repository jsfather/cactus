import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { orders, products, productVariants, orderItems } from "@/lib/db/schema";
export const effectiveInventory = sql<number>`case when exists(select 1 from ${productVariants} where ${productVariants.productId} = ${products.id} and ${productVariants.isActive}) then (select coalesce(sum(${productVariants.inventory}),0)::int from ${productVariants} where ${productVariants.productId} = ${products.id} and ${productVariants.isActive}) else ${products.inventory} end`;
export async function getOrderStats(userId?: string) {
  const [stats] = await getDatabase()
    .select({
      total: sql<number>`count(*)::int`,
      awaiting: sql<number>`count(*) filter(where ${orders.paymentStatus}='pending' and ${orders.status}<>'cancelled')::int`,
      active: sql<number>`count(*) filter(where ${orders.status} in ('processing','packing'))::int`,
      shipped: sql<number>`count(*) filter(where ${orders.status}='shipped')::int`,
      delivered: sql<number>`count(*) filter(where ${orders.status}='delivered')::int`,
      cancelled: sql<number>`count(*) filter(where ${orders.status}='cancelled')::int`,
      revenue: sql<number>`coalesce(sum(${orders.totalToman}) filter(where ${orders.paymentStatus}='paid' and ${orders.status}<>'cancelled'),0)::float8`,
    })
    .from(orders)
    .where(userId ? eq(orders.userId, userId) : undefined);
  return stats;
}
export async function getProductStats() {
  const db = getDatabase();
  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter(where ${products.status}='published')::int`,
      low: sql<number>`count(*) filter(where (${effectiveInventory}) between 1 and 4)::int`,
      out: sql<number>`count(*) filter(where (${effectiveInventory})=0)::int`,
    })
    .from(products);
  const best = await db
    .select({
      id: products.id,
      titleFa: products.titleFa,
      titleEn: products.titleEn,
      quantity: sql<number>`sum(${orderItems.quantity})::int`,
      revenue: sql<number>`sum(${orderItems.quantity} * ${orderItems.unitPriceToman})::float8`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(products.id, orderItems.productId))
    .where(
      and(eq(orders.paymentStatus, "paid"), sql`${orders.status}<>'cancelled'`),
    )
    .groupBy(products.id)
    .orderBy(sql`sum(${orderItems.quantity}) desc`, products.id)
    .limit(5);
  const [sold] = await db
    .select({
      units: sql<number>`coalesce(sum(${orderItems.quantity}),0)::int`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orders.paymentStatus, "paid"),
        sql`${orders.status}<>'cancelled'`,
        sql`${orderItems.productId} is not null`,
      ),
    );
  return { ...stats, best, units: sold.units };
}
