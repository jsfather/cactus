"use server";

import { and, eq, max, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { products, productVariants } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

const variantSchema = z.object({
  sku: z.string().trim().min(2).max(120).transform((value) => value.toUpperCase()).refine((value) => /^[A-Z0-9._-]+$/.test(value)),
  titleFa: z.string().trim().min(2).max(180),
  titleEn: z.string().trim().max(180),
  price: z.string().trim().refine((value) => !value || /^\d+$/.test(value)).transform((value) => value ? Number(value) : null).refine((value) => value === null || value <= 999_999_999_999),
  inventory: z.coerce.number().int().min(0).max(10_000_000),
  isActive: z.boolean(),
  locale: z.enum(["fa", "en"]),
});

export type VariantFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type VariantMutationState = { error?: string; success?: string };

function read(formData: FormData) { return { sku: formData.get("sku"), titleFa: formData.get("titleFa"), titleEn: formData.get("titleEn"), price: formData.get("price"), inventory: formData.get("inventory"), isActive: formData.get("isActive") === "on", locale: formData.get("locale") }; }
function refresh(productId: string) { revalidatePath(`/panel/admin/products/${productId}/edit`); revalidatePath("/shop"); revalidatePath("/en/shop"); }

export async function createVariant(productIdValue: string, _state: VariantFormState, formData: FormData): Promise<VariantFormState> {
  await requireRole("admin");
  const productId = z.uuid().safeParse(productIdValue);
  const parsed = variantSchema.safeParse(read(formData));
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!productId.success || !parsed.success) return { error: locale === "fa" ? "اطلاعات تنوع را بررسی کنید." : "Please review the variant information.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  try {
    await getDatabase().transaction(async (transaction) => {
      const product = await transaction.execute(
        sql`select ${products.id} from ${products} where ${products.id} = ${productId.data} for update`,
      );
      if (!product.rowCount) throw new Error("PRODUCT_NOT_FOUND");
      const [position] = await transaction.select({ value: max(productVariants.sortOrder) }).from(productVariants).where(eq(productVariants.productId, productId.data));
      await transaction.insert(productVariants).values({ productId: productId.data, sku: parsed.data.sku, titleFa: parsed.data.titleFa, titleEn: parsed.data.titleEn || null, price: parsed.data.price, inventory: parsed.data.inventory, isActive: parsed.data.isActive, sortOrder: (position.value ?? 0) + 1 });
      await transaction.update(products).set({ updatedAt: new Date() }).where(eq(products.id, productId.data));
    });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "این کد SKU قبلاً استفاده شده است." : "This SKU is already in use." };
    return { error: locale === "fa" ? "ذخیره تنوع انجام نشد." : "The variant could not be saved." };
  }
  refresh(productId.data);
  redirect(`/panel/admin/products/${productId.data}/edit?toast=variant-created`);
}

export async function updateVariant(productIdValue: string, variantIdValue: string, _state: VariantFormState, formData: FormData): Promise<VariantFormState> {
  await requireRole("admin");
  const productId = z.uuid().safeParse(productIdValue); const variantId = z.uuid().safeParse(variantIdValue);
  const parsed = variantSchema.safeParse(read(formData)); const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!productId.success || !variantId.success || !parsed.success) return { error: locale === "fa" ? "اطلاعات تنوع را بررسی کنید." : "Please review the variant information.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  try {
    const changed = await getDatabase().update(productVariants).set({ sku: parsed.data.sku, titleFa: parsed.data.titleFa, titleEn: parsed.data.titleEn || null, price: parsed.data.price, inventory: parsed.data.inventory, isActive: parsed.data.isActive, updatedAt: new Date() }).where(and(eq(productVariants.id, variantId.data), eq(productVariants.productId, productId.data))).returning({ id: productVariants.id });
    if (!changed.length) return { error: locale === "fa" ? "تنوع پیدا نشد." : "The variant was not found." };
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "این کد SKU قبلاً استفاده شده است." : "This SKU is already in use." };
    return { error: locale === "fa" ? "به‌روزرسانی تنوع انجام نشد." : "The variant could not be updated." };
  }
  refresh(productId.data);
  redirect(`/panel/admin/products/${productId.data}/edit?toast=variant-updated`);
}

export async function deleteVariant(productIdValue: string, variantIdValue: string, locale: Locale): Promise<VariantMutationState> {
  await requireRole("admin"); const productId = z.uuid().safeParse(productIdValue); const variantId = z.uuid().safeParse(variantIdValue);
  if (!productId.success || !variantId.success) return { error: locale === "fa" ? "شناسه تنوع معتبر نیست." : "The variant identifier is invalid." };
  try {
    const removed = await getDatabase().delete(productVariants).where(and(eq(productVariants.id, variantId.data), eq(productVariants.productId, productId.data))).returning({ id: productVariants.id });
    if (!removed.length) return { error: locale === "fa" ? "تنوع پیدا نشد." : "The variant was not found." };
  } catch { return { error: locale === "fa" ? "حذف تنوع انجام نشد." : "The variant could not be deleted." }; }
  refresh(productId.data); return { success: locale === "fa" ? "تنوع حذف شد." : "Variant deleted." };
}
