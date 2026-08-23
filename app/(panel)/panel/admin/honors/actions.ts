"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { honors } from "@/lib/db/schema";
import { createHonorSchema, type HonorInput } from "@/lib/honors/validation";
import type { Locale } from "@/lib/i18n/config";

export type HonorFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type DeleteHonorState = { error?: string; success?: string };

function readForm(formData: FormData) {
  return {
    slug: formData.get("slug"),
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    descriptionFa: formData.get("descriptionFa"),
    descriptionEn: formData.get("descriptionEn"),
    organizationFa: formData.get("organizationFa"),
    organizationEn: formData.get("organizationEn"),
    locationFa: formData.get("locationFa"),
    locationEn: formData.get("locationEn"),
    categoriesFa: formData.get("categoriesFa"),
    categoriesEn: formData.get("categoriesEn"),
    certificateImageUrl: formData.get("certificateImageUrl"),
    issuedAt: formData.get("issuedAt"),
    status: formData.get("status"),
    locale: formData.get("locale"),
  };
}

function revalidateHonorPaths() {
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/honors");
  revalidatePath("/en/honors");
  revalidatePath("/panel/admin/honors");
  revalidatePath("/sitemap.xml");
}

function values(data: HonorInput, previousPublishedAt?: Date | null) {
  return {
    slug: data.slug,
    titleFa: data.titleFa,
    titleEn: data.titleEn || null,
    descriptionFa: data.descriptionFa,
    descriptionEn: data.descriptionEn || null,
    organizationFa: data.organizationFa,
    organizationEn: data.organizationEn || null,
    locationFa: data.locationFa,
    locationEn: data.locationEn || null,
    categoriesFa: data.categoriesFa,
    categoriesEn: data.categoriesEn,
    certificateImageUrl: data.certificateImageUrl,
    issuedAt: data.issuedAt,
    status: data.status,
    publishedAt: data.status === "published" ? previousPublishedAt ?? new Date() : null,
  };
}

export async function createHonor(_state: HonorFormState, formData: FormData): Promise<HonorFormState> {
  const admin = await requireRole("admin");
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  const parsed = createHonorSchema(locale).safeParse(readForm(formData));
  if (!parsed.success) return { error: locale === "fa" ? "لطفاً اطلاعات افتخار یا گواهینامه را بررسی کنید." : "Please review the honor or certificate information.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  try {
    await getDatabase().insert(honors).values({ ...values(parsed.data), creatorId: admin.id });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "این نشانی قبلاً استفاده شده است." : "This URL is already in use." };
    throw error;
  }
  revalidateHonorPaths();
  redirect("/panel/admin/honors?toast=created");
}

export async function updateHonor(id: string, _state: HonorFormState, formData: FormData): Promise<HonorFormState> {
  await requireRole("admin");
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  const validId = z.uuid().safeParse(id);
  const parsed = createHonorSchema(locale).safeParse(readForm(formData));
  if (!validId.success || !parsed.success) return { error: locale === "fa" ? "لطفاً اطلاعات افتخار یا گواهینامه را بررسی کنید." : "Please review the honor or certificate information.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  const database = getDatabase();
  const [existing] = await database.select({ publishedAt: honors.publishedAt }).from(honors).where(eq(honors.id, validId.data)).limit(1);
  if (!existing) return { error: locale === "fa" ? "این مورد دیگر وجود ندارد." : "This item no longer exists." };
  try {
    await database.update(honors).set({ ...values(parsed.data, existing.publishedAt), updatedAt: new Date() }).where(eq(honors.id, validId.data));
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "این نشانی قبلاً استفاده شده است." : "This URL is already in use." };
    throw error;
  }
  revalidateHonorPaths();
  redirect("/panel/admin/honors?toast=updated");
}

export async function deleteHonor(id: string, locale: Locale): Promise<DeleteHonorState> {
  await requireRole("admin");
  const validId = z.uuid().safeParse(id);
  if (!validId.success) return { error: locale === "fa" ? "شناسه معتبر نیست." : "The identifier is invalid." };
  const [deleted] = await getDatabase().delete(honors).where(eq(honors.id, validId.data)).returning({ id: honors.id });
  if (!deleted) return { error: locale === "fa" ? "این مورد دیگر وجود ندارد." : "This item no longer exists." };
  revalidateHonorPaths();
  return { success: locale === "fa" ? "افتخار یا گواهینامه حذف شد." : "Honor or certificate deleted." };
}
