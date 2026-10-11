import { and, asc, desc, eq, gt, ilike, lt, lte, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  productCategories,
  productCategoryAssignments,
  products,
  productVariants,
  users,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
  type AdminListQuery,
  type PaginatedResult,
} from "@/lib/panel/pagination";

function publicProductSelection(locale: Locale) {
  return {
    tags: products.tags,
    compareAtPrice: products.compareAtPrice,
    hasVariants: sql<boolean>`exists(select 1 from ${productVariants} where ${productVariants.productId} = ${products.id} and ${productVariants.isActive} = true)`,
    variantLabels: sql<{ id: string; titleFa: string; titleEn: string | null; price: number | null; inventory: number }[]>`coalesce((select json_agg(v order by v."sortOrder", v.id) from (select ${productVariants.id} as id, ${productVariants.titleFa} as "titleFa", ${productVariants.titleEn} as "titleEn", ${productVariants.price} as price, ${productVariants.inventory} as inventory, ${productVariants.sortOrder} as "sortOrder" from ${productVariants} where ${productVariants.productId} = ${products.id} and ${productVariants.isActive} = true) v), '[]'::json)`,
    availableInventory: sql<number>`case when exists(select 1 from ${productVariants} where ${productVariants.productId} = ${products.id} and ${productVariants.isActive} = true) then (select coalesce(sum(${productVariants.inventory}), 0)::int from ${productVariants} where ${productVariants.productId} = ${products.id} and ${productVariants.isActive} = true) else ${products.inventory} end`,
    specificationsFa: products.specificationsFa,
    specificationsEn: products.specificationsEn,
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
    authorName: locale === "fa"
      ? sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`
      : sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`,
  };
}

export function getPublishedProducts(locale: Locale, limit?: number, categorySlug?: string, search?: string, tag?: string) {
  const query = getDatabase()
    .select(publicProductSelection(locale))
    .from(products)
    .innerJoin(users, eq(products.authorId, users.id))
    .where(and(
      eq(products.status, "published"),
      lte(products.publishedAt, new Date()),
      search ? or(ilike(products.titleFa, `%${escapeLikePattern(search.slice(0, 100))}%`), ilike(products.titleEn, `%${escapeLikePattern(search.slice(0, 100))}%`), ilike(products.summaryFa, `%${escapeLikePattern(search.slice(0, 100))}%`)) : undefined,
      tag ? sql`${tag.slice(0, 80)} = any(${products.tags})` : undefined,
      categorySlug
        ? sql`exists (
            select 1
            from ${productCategoryAssignments}
            inner join ${productCategories}
              on ${productCategories.id} = ${productCategoryAssignments.categoryId}
            where ${productCategoryAssignments.productId} = ${products.id}
              and ${productCategories.slug} = ${categorySlug}
          )`
        : undefined,
    ))
    .orderBy(desc(products.isFeatured), desc(products.publishedAt));

  return limit ? query.limit(limit) : query;
}

export async function getPublishedProduct(slug: string, locale: Locale) {
  const database = getDatabase();
  const [product] = await database
    .select(publicProductSelection(locale))
    .from(products)
    .innerJoin(users, eq(products.authorId, users.id))
    .where(and(
      eq(products.slug, slug),
      eq(products.status, "published"),
      lte(products.publishedAt, new Date()),
    ))
    .limit(1);
  if (!product) return null;
  const [variants, categories] = await Promise.all([
    database
      .select()
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, product.id),
          eq(productVariants.isActive, true),
        ),
      )
      .orderBy(asc(productVariants.sortOrder)),
    database
      .select({
        id: productCategories.id,
        slug: productCategories.slug,
        titleFa: productCategories.titleFa,
        titleEn: productCategories.titleEn,
      })
      .from(productCategoryAssignments)
      .innerJoin(
        productCategories,
        eq(productCategoryAssignments.categoryId, productCategories.id),
      )
      .where(eq(productCategoryAssignments.productId, product.id))
      .orderBy(asc(productCategories.titleFa)),
  ]);
  return { ...product, variants, categories };
}

export type ProductStatusFilter = "all" | "draft" | "published";
export type ProductFeaturedFilter = "all" | "featured" | "standard";
export type ProductStockFilter = "all" | "in_stock" | "low" | "out";

export async function getAdminProducts(
  query: AdminListQuery & {
    featured: ProductFeaturedFilter;
    status: ProductStatusFilter;
    stock: ProductStockFilter;
  },
): Promise<PaginatedResult<{
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string | null;
  price: number;
  inventory: number;
  status: "draft" | "published";
  isFeatured: boolean;
  updatedAt: Date;
}>> {
  const database = getDatabase();
  const pattern = `%${escapeLikePattern(query.q)}%`;
  const where = and(
    query.status === "all" ? undefined : eq(products.status, query.status),
    query.featured === "featured"
      ? eq(products.isFeatured, true)
      : query.featured === "standard"
        ? eq(products.isFeatured, false)
        : undefined,
    query.stock === "out"
      ? eq(products.inventory, 0)
      : query.stock === "low"
        ? and(gt(products.inventory, 0), lt(products.inventory, 5))
        : query.stock === "in_stock"
          ? gt(products.inventory, 0)
          : undefined,
    query.q
      ? or(
          ilike(products.slug, pattern),
          ilike(products.titleFa, pattern),
          ilike(products.titleEn, pattern),
        )
      : undefined,
  );
  const [{ total }] = await database
    .select({ total: sql<number>`count(*)::int` })
    .from(products)
    .where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await database
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
    .where(where)
    .orderBy(desc(products.updatedAt))
    .limit(ADMIN_PAGE_SIZE)
    .offset((page - 1) * ADMIN_PAGE_SIZE);

  return { items, page, pageCount, pageSize: ADMIN_PAGE_SIZE, total };
}

export async function getAdminProduct(productId: string) {
  const [product] = await getDatabase().select().from(products).where(eq(products.id, productId)).limit(1);
  return product ?? null;
}

export async function getPublicProductTags() {
  const rows = await getDatabase().select({ tag: sql<string>`distinct unnest(${products.tags})` }).from(products).where(and(eq(products.status, "published"), lte(products.publishedAt, new Date())));
  return rows.map(r => r.tag).sort((a, b) => a.localeCompare(b));
}
