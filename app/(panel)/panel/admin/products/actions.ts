"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { richTextLength, sanitizeRichText } from "@/lib/content/rich-text";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { productCategoryAssignments, products } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { isAllowedImageReference } from "@/lib/media/reference";

const slugPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
const productSchema = z.object({
  slug: z.string().trim().min(2).max(180).transform((value) => value.toLowerCase().replace(/\s+/g, "-")).refine((value) => slugPattern.test(value)),
  titleFa: z.string().trim().min(3).max(240),
  titleEn: z.string().trim().max(240),
  summaryFa: z.string().trim().min(10).max(600),
  summaryEn: z.string().trim().max(600),
  contentFa: z.string().transform(sanitizeRichText).refine((value) => richTextLength(value) >= 20),
  contentEn: z.string().transform(sanitizeRichText),
  coverImageUrl: z.string().trim().max(2048).refine(isAllowedImageReference),
  tags: z.string().trim().max(2000).transform(v => [...new Set(v.split(/[,،\n]/).map(t => t.trim()).filter(Boolean))]).refine(v => v.length <= 20 && v.every(t => t.length <= 80)),
  compareAtPrice: z.preprocess(v => v === "" || v == null ? null : Number(v), z.number().int().min(0).max(999_999_999_999).nullable()),
  price: z.coerce.number().int().min(0).max(999_999_999_999),
  inventory: z.coerce.number().int().min(0).max(10_000_000),
  status: z.enum(["draft", "published"]),
  isFeatured: z.boolean(),
  categoryIds: z.array(z.uuid()).max(12).transform((ids) => [...new Set(ids)]),
  locale: z.enum(["fa", "en"]),
}).refine(v => v.compareAtPrice === null || v.compareAtPrice > v.price, { path: ["compareAtPrice"], message: "Original price must exceed sale price" });

export type ProductFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type DeleteProductState = { error?: string; success?: string };

function readProductForm(formData: FormData) {
  let categoryIds: unknown = [];
  try {
    const value = formData.get("categoryIds");
    categoryIds = typeof value === "string" ? JSON.parse(value) : [];
  } catch {
    categoryIds = [];
  }
  return {
    tags: formData.get("tags") ?? "", compareAtPrice: formData.get("compareAtPrice"), slug: formData.get("slug"), titleFa: formData.get("titleFa"), titleEn: formData.get("titleEn"),
    summaryFa: formData.get("summaryFa"), summaryEn: formData.get("summaryEn"),
    contentFa: formData.get("contentFa"), contentEn: formData.get("contentEn"),
    coverImageUrl: formData.get("coverImageUrl"), price: formData.get("price"), inventory: formData.get("inventory"),
    status: formData.get("status"), isFeatured: formData.get("isFeatured") === "on", categoryIds, locale: formData.get("locale"),
  };
}

function revalidateShop() {
  for (const path of ["/", "/en", "/shop", "/en/shop", "/panel/admin/products"]) revalidatePath(path);
}

function productFieldErrors(error: z.ZodError, locale: unknown) {
  const isEn = locale === "en";
  return Object.fromEntries(Object.keys(z.flattenError(error).fieldErrors).map(key => [key, [key === "compareAtPrice" ? (isEn ? "Original price must be greater than the selling price." : "قیمت قبل از تخفیف باید بیشتر از قیمت فروش باشد.") : key === "tags" ? (isEn ? "Use at most 20 tags, up to 80 characters each." : "حداکثر ۲۰ برچسب با طول حداکثر ۸۰ حرف وارد کنید.") : (isEn ? "Please review this field." : "لطفاً این فیلد را بررسی کنید.")]]));
}

function formError(locale: unknown) {
  return locale === "en" ? "Please review the product information." : "لطفاً اطلاعات محصول را بررسی کنید.";
}

export async function createProduct(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const admin = await requireRole("admin");
  const parsed = productSchema.safeParse(readProductForm(formData));
  if (!parsed.success) return { error: formError(formData.get("locale")), fieldErrors: productFieldErrors(parsed.error, formData.get("locale")) };
  const data = parsed.data;
  let createdId: string;
  try {
    const [created] = await getDatabase().transaction(async (transaction) => {
      const rows = await transaction.insert(products).values({
        tags: data.tags, compareAtPrice: data.compareAtPrice, slug: data.slug, titleFa: data.titleFa, titleEn: data.titleEn || null,
        summaryFa: data.summaryFa, summaryEn: data.summaryEn || null,
        contentFa: data.contentFa, contentEn: data.contentEn || null,
        coverImageUrl: data.coverImageUrl || null, price: data.price, inventory: data.inventory,
        status: data.status, isFeatured: data.isFeatured,
        publishedAt: data.status === "published" ? new Date() : null, authorId: admin.id,
      }).returning({ id: products.id });
      if (data.categoryIds.length) {
        await transaction.insert(productCategoryAssignments).values(
          data.categoryIds.map((categoryId) => ({ productId: rows[0].id, categoryId })),
        );
      }
      return rows;
    });
    createdId = created.id;
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: data.locale === "en" ? "This product URL is already in use." : "این نشانی قبلاً برای محصول دیگری استفاده شده است.", fieldErrors: {slug: [data.locale === "en" ? "This URL is already in use." : "این نشانی قبلاً استفاده شده است."]} };
    }
    if (hasPostgresErrorCode(error, "23503")) {
      return { error: data.locale === "en" ? "One of the selected categories is no longer available." : "یکی از دسته‌های انتخاب‌شده دیگر موجود نیست." };
    }
    return { error: data.locale === "en" ? "The product could not be saved." : "ذخیره محصول انجام نشد." };
  }
  revalidateShop();
  redirect(`/panel/admin/products/${createdId}/edit?toast=created`);
}

export async function updateProduct(productId: string, _state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireRole("admin");
  const validId = z.uuid().safeParse(productId);
  const parsed = productSchema.safeParse(readProductForm(formData));
  if (!validId.success || !parsed.success) return { error: formError(formData.get("locale")), fieldErrors: parsed.success ? undefined : productFieldErrors(parsed.error, formData.get("locale")) };
  const database = getDatabase();
  const [existing] = await database.select({ publishedAt: products.publishedAt }).from(products).where(eq(products.id, validId.data)).limit(1);
  if (!existing) return { error: parsed.data.locale === "en" ? "This product no longer exists." : "این محصول دیگر وجود ندارد." };
  const data = parsed.data;
  try {
    await database.transaction(async (transaction) => {
      await transaction.update(products).set({
        tags: data.tags, compareAtPrice: data.compareAtPrice, slug: data.slug, titleFa: data.titleFa, titleEn: data.titleEn || null,
        summaryFa: data.summaryFa, summaryEn: data.summaryEn || null,
        contentFa: data.contentFa, contentEn: data.contentEn || null,
        coverImageUrl: data.coverImageUrl || null, price: data.price, inventory: data.inventory,
        status: data.status, isFeatured: data.isFeatured,
        publishedAt: data.status === "published" ? existing.publishedAt ?? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(products.id, validId.data));
      await transaction.delete(productCategoryAssignments).where(eq(productCategoryAssignments.productId, validId.data));
      if (data.categoryIds.length) {
        await transaction.insert(productCategoryAssignments).values(
          data.categoryIds.map((categoryId) => ({ productId: validId.data, categoryId })),
        );
      }
    });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: data.locale === "en" ? "This product URL is already in use." : "این نشانی قبلاً برای محصول دیگری استفاده شده است.", fieldErrors: {slug: [data.locale === "en" ? "This URL is already in use." : "این نشانی قبلاً استفاده شده است."]} };
    if (hasPostgresErrorCode(error, "23503")) return { error: data.locale === "en" ? "One of the selected categories is no longer available." : "یکی از دسته‌های انتخاب‌شده دیگر موجود نیست." };
    return { error: data.locale === "en" ? "The product could not be updated." : "به‌روزرسانی محصول انجام نشد." };
  }
  revalidateShop();
  redirect("/panel/admin/products?toast=updated");
}

export async function deleteProduct(productIdValue: string, locale: Locale): Promise<DeleteProductState> {
  await requireRole("admin");
  const productId = z.uuid().safeParse(productIdValue);
  if (!productId.success) return { error: locale === "fa" ? "شناسه محصول معتبر نیست." : "The product identifier is invalid." };
  try {
    await getDatabase().delete(products).where(eq(products.id, productId.data));
  } catch {
    return { error: locale === "fa" ? "حذف محصول انجام نشد. دوباره تلاش کنید." : "The product could not be deleted. Please try again." };
  }
  revalidateShop();
  return { success: locale === "fa" ? "محصول حذف شد." : "Product deleted." };
}
