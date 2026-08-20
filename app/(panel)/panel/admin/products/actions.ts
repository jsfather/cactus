"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { richTextLength, sanitizeRichText } from "@/lib/content/rich-text";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { products } from "@/lib/db/schema";
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
  price: z.coerce.number().int().min(0).max(999_999_999_999),
  inventory: z.coerce.number().int().min(0).max(10_000_000),
  status: z.enum(["draft", "published"]),
  isFeatured: z.boolean(),
  locale: z.enum(["fa", "en"]),
});

export type ProductFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type DeleteProductState = { error?: string; success?: string };

function readProductForm(formData: FormData) {
  return {
    slug: formData.get("slug"), titleFa: formData.get("titleFa"), titleEn: formData.get("titleEn"),
    summaryFa: formData.get("summaryFa"), summaryEn: formData.get("summaryEn"),
    contentFa: formData.get("contentFa"), contentEn: formData.get("contentEn"),
    coverImageUrl: formData.get("coverImageUrl"), price: formData.get("price"), inventory: formData.get("inventory"),
    status: formData.get("status"), isFeatured: formData.get("isFeatured") === "on", locale: formData.get("locale"),
  };
}

function revalidateShop() {
  for (const path of ["/", "/en", "/shop", "/en/shop", "/panel/admin/products"]) revalidatePath(path);
}

function formError(locale: unknown) {
  return locale === "en" ? "Please review the product information." : "لطفاً اطلاعات محصول را بررسی کنید.";
}

export async function createProduct(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const admin = await requireRole("admin");
  const parsed = productSchema.safeParse(readProductForm(formData));
  if (!parsed.success) return { error: formError(formData.get("locale")), fieldErrors: z.flattenError(parsed.error).fieldErrors };
  const data = parsed.data;
  try {
    await getDatabase().insert(products).values({
      slug: data.slug, titleFa: data.titleFa, titleEn: data.titleEn || null,
      summaryFa: data.summaryFa, summaryEn: data.summaryEn || null,
      contentFa: data.contentFa, contentEn: data.contentEn || null,
      coverImageUrl: data.coverImageUrl || null, price: data.price, inventory: data.inventory,
      status: data.status, isFeatured: data.isFeatured,
      publishedAt: data.status === "published" ? new Date() : null, authorId: admin.id,
    });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: data.locale === "en" ? "This product URL is already in use." : "این نشانی قبلاً برای محصول دیگری استفاده شده است." };
    }
    throw error;
  }
  revalidateShop();
  redirect("/panel/admin/products?toast=created");
}

export async function updateProduct(productId: string, _state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireRole("admin");
  const validId = z.uuid().safeParse(productId);
  const parsed = productSchema.safeParse(readProductForm(formData));
  if (!validId.success || !parsed.success) return { error: formError(formData.get("locale")), fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  const database = getDatabase();
  const [existing] = await database.select({ publishedAt: products.publishedAt }).from(products).where(eq(products.id, validId.data)).limit(1);
  if (!existing) return { error: parsed.data.locale === "en" ? "This product no longer exists." : "این محصول دیگر وجود ندارد." };
  const data = parsed.data;
  try {
    await database.update(products).set({
      slug: data.slug, titleFa: data.titleFa, titleEn: data.titleEn || null,
      summaryFa: data.summaryFa, summaryEn: data.summaryEn || null,
      contentFa: data.contentFa, contentEn: data.contentEn || null,
      coverImageUrl: data.coverImageUrl || null, price: data.price, inventory: data.inventory,
      status: data.status, isFeatured: data.isFeatured,
      publishedAt: data.status === "published" ? existing.publishedAt ?? new Date() : null,
      updatedAt: new Date(),
    }).where(eq(products.id, validId.data));
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: data.locale === "en" ? "This product URL is already in use." : "این نشانی قبلاً برای محصول دیگری استفاده شده است." };
    throw error;
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
