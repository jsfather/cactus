import { asc, count, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  productCategories,
  productCategoryAssignments,
  productVariants,
} from "@/lib/db/schema";

export async function getProductCategories() {
  return getDatabase()
    .select()
    .from(productCategories)
    .orderBy(asc(productCategories.titleFa));
}

export async function getAdminProductCategories() {
  return getDatabase()
    .select({
      id: productCategories.id,
      slug: productCategories.slug,
      titleFa: productCategories.titleFa,
      titleEn: productCategories.titleEn,
      descriptionFa: productCategories.descriptionFa,
      descriptionEn: productCategories.descriptionEn,
      productCount: count(productCategoryAssignments.productId),
      updatedAt: productCategories.updatedAt,
    })
    .from(productCategories)
    .leftJoin(
      productCategoryAssignments,
      eq(productCategoryAssignments.categoryId, productCategories.id),
    )
    .groupBy(productCategories.id)
    .orderBy(asc(productCategories.titleFa));
}

export async function getProductCategory(categoryId: string) {
  const [category] = await getDatabase()
    .select()
    .from(productCategories)
    .where(eq(productCategories.id, categoryId))
    .limit(1);
  return category ?? null;
}

export async function getProductCategoryIds(productId: string) {
  const rows = await getDatabase()
    .select({ categoryId: productCategoryAssignments.categoryId })
    .from(productCategoryAssignments)
    .where(eq(productCategoryAssignments.productId, productId));
  return rows.map((row) => row.categoryId);
}

export async function getProductVariants(productId: string, activeOnly = false) {
  return getDatabase()
    .select()
    .from(productVariants)
    .where(
      activeOnly
        ? sql`${productVariants.productId} = ${productId} and ${productVariants.isActive} = true`
        : eq(productVariants.productId, productId),
    )
    .orderBy(asc(productVariants.sortOrder));
}

export async function getProductVariant(productId: string, variantId: string) {
  const [variant] = await getDatabase()
    .select()
    .from(productVariants)
    .where(
      sql`${productVariants.id} = ${variantId} and ${productVariants.productId} = ${productId}`,
    )
    .limit(1);
  return variant ?? null;
}
