import { and, desc, eq, isNotNull, lte } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { products, users } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

const publicProductSelection = {
  id: products.id,
  slug: products.slug,
  titleFa: products.titleFa,
  titleEn: products.titleEn,
  summaryFa: products.summaryFa,
  summaryEn: products.summaryEn,
  contentFa: products.contentFa,
  contentEn: products.contentEn,
  price: products.price,
  inventory: products.inventory,
  coverImageUrl: products.coverImageUrl,
  isFeatured: products.isFeatured,
  publishedAt: products.publishedAt,
  authorName: users.name,
};

export function getPublishedProducts(locale: Locale, limit?: number) {
  const query = getDatabase()
    .select(publicProductSelection)
    .from(products)
    .innerJoin(users, eq(products.authorId, users.id))
    .where(and(
      eq(products.status, "published"),
      lte(products.publishedAt, new Date()),
      locale === "en" ? isNotNull(products.titleEn) : undefined,
      locale === "en" ? isNotNull(products.summaryEn) : undefined,
      locale === "en" ? isNotNull(products.contentEn) : undefined,
    ))
    .orderBy(desc(products.isFeatured), desc(products.publishedAt));

  return limit ? query.limit(limit) : query;
}

export async function getPublishedProduct(slug: string, locale: Locale) {
  const [product] = await getDatabase()
    .select(publicProductSelection)
    .from(products)
    .innerJoin(users, eq(products.authorId, users.id))
    .where(and(
      eq(products.slug, slug),
      eq(products.status, "published"),
      lte(products.publishedAt, new Date()),
      locale === "en" ? isNotNull(products.titleEn) : undefined,
      locale === "en" ? isNotNull(products.summaryEn) : undefined,
      locale === "en" ? isNotNull(products.contentEn) : undefined,
    ))
    .limit(1);
  return product ?? null;
}

export function getAdminProducts() {
  return getDatabase()
    .select({
      id: products.id,
      slug: products.slug,
      titleFa: products.titleFa,
      titleEn: products.titleEn,
      price: products.price,
      inventory: products.inventory,
      status: products.status,
      isFeatured: products.isFeatured,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .orderBy(desc(products.updatedAt));
}

export async function getAdminProduct(productId: string) {
  const [product] = await getDatabase().select().from(products).where(eq(products.id, productId)).limit(1);
  return product ?? null;
}
