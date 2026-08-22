"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { productCategories } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

const slugPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
const categorySchema = z.object({
  slug: z.string().trim().min(2).max(180).transform((value) => value.toLowerCase().replace(/\s+/g, "-")).refine((value) => slugPattern.test(value)),
  titleFa: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().max(160),
  descriptionFa: z.string().trim().max(1000),
  descriptionEn: z.string().trim().max(1000),
  locale: z.enum(["fa", "en"]),
});

export type CategoryFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type CategoryMutationState = { error?: string; success?: string };

function read(formData: FormData) {
  return { slug: formData.get("slug"), titleFa: formData.get("titleFa"), titleEn: formData.get("titleEn"), descriptionFa: formData.get("descriptionFa"), descriptionEn: formData.get("descriptionEn"), locale: formData.get("locale") };
}

function refresh() {
  revalidatePath("/panel/admin/product-categories");
  revalidatePath("/panel/admin/products");
  revalidatePath("/shop");
  revalidatePath("/en/shop");
}

export async function createCategory(_state: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireRole("admin");
  const parsed = categorySchema.safeParse(read(formData));
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!parsed.success) return { error: locale === "fa" ? "اطلاعات دسته را بررسی کنید." : "Please review the category information.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  try {
    await getDatabase().insert(productCategories).values({ slug: parsed.data.slug, titleFa: parsed.data.titleFa, titleEn: parsed.data.titleEn || null, descriptionFa: parsed.data.descriptionFa || null, descriptionEn: parsed.data.descriptionEn || null });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "این نشانی دسته قبلاً استفاده شده است." : "This category URL is already in use." };
    return { error: locale === "fa" ? "ذخیره دسته انجام نشد." : "The category could not be saved." };
  }
  refresh();
  redirect("/panel/admin/product-categories?toast=created");
}

export async function updateCategory(categoryIdValue: string, _state: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireRole("admin");
  const categoryId = z.uuid().safeParse(categoryIdValue);
  const parsed = categorySchema.safeParse(read(formData));
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!categoryId.success || !parsed.success) return { error: locale === "fa" ? "اطلاعات دسته را بررسی کنید." : "Please review the category information.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  try {
    const changed = await getDatabase().update(productCategories).set({ slug: parsed.data.slug, titleFa: parsed.data.titleFa, titleEn: parsed.data.titleEn || null, descriptionFa: parsed.data.descriptionFa || null, descriptionEn: parsed.data.descriptionEn || null, updatedAt: new Date() }).where(eq(productCategories.id, categoryId.data)).returning({ id: productCategories.id });
    if (!changed.length) return { error: locale === "fa" ? "دسته پیدا نشد." : "The category was not found." };
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "این نشانی دسته قبلاً استفاده شده است." : "This category URL is already in use." };
    return { error: locale === "fa" ? "به‌روزرسانی دسته انجام نشد." : "The category could not be updated." };
  }
  refresh();
  redirect("/panel/admin/product-categories?toast=updated");
}

export async function deleteCategory(categoryIdValue: string, locale: Locale): Promise<CategoryMutationState> {
  await requireRole("admin");
  const categoryId = z.uuid().safeParse(categoryIdValue);
  if (!categoryId.success) return { error: locale === "fa" ? "شناسه دسته معتبر نیست." : "The category identifier is invalid." };
  try {
    const removed = await getDatabase().delete(productCategories).where(eq(productCategories.id, categoryId.data)).returning({ id: productCategories.id });
    if (!removed.length) return { error: locale === "fa" ? "دسته پیدا نشد." : "The category was not found." };
  } catch {
    return { error: locale === "fa" ? "حذف دسته انجام نشد." : "The category could not be deleted." };
  }
  refresh();
  return { success: locale === "fa" ? "دسته حذف شد." : "Category deleted." };
}
