"use server";

import { eq, max, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { termLevels } from "@/lib/db/schema";
import { termLevelSchema } from "@/lib/terms/validation";

export type TermLevelFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type TermLevelMutationState = { error?: string; success?: string };

function read(formData: FormData) {
  return {
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    descriptionFa: formData.get("descriptionFa"),
    descriptionEn: formData.get("descriptionEn"),
    locale: formData.get("locale"),
  };
}

function refresh() {
  revalidatePath("/panel/admin/term-levels");
  revalidatePath("/panel/admin/terms");
}

export async function createTermLevel(_state: TermLevelFormState, formData: FormData): Promise<TermLevelFormState> {
  await requireRole("admin");
  const parsed = termLevelSchema.safeParse(read(formData));
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!parsed.success) return { error: locale === "fa" ? "اطلاعات سطح را بررسی کنید." : "Review the level information.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  try {
    await getDatabase().transaction(async (transaction) => {
      await transaction.execute(sql`lock table ${termLevels} in share row exclusive mode`);
      const [result] = await transaction.select({ value: max(termLevels.sortOrder) }).from(termLevels);
      await transaction.insert(termLevels).values({
        titleFa: parsed.data.titleFa,
        titleEn: parsed.data.titleEn || null,
        descriptionFa: parsed.data.descriptionFa || null,
        descriptionEn: parsed.data.descriptionEn || null,
        sortOrder: (result.value ?? 0) + 1,
      });
    });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "سطحی با این عنوان وجود دارد." : "A level with this title already exists." };
    return { error: locale === "fa" ? "سطح ذخیره نشد." : "The level could not be saved." };
  }
  refresh();
  redirect("/panel/admin/term-levels?toast=created");
}

export async function updateTermLevel(levelIdValue: string, _state: TermLevelFormState, formData: FormData): Promise<TermLevelFormState> {
  await requireRole("admin");
  const levelId = z.uuid().safeParse(levelIdValue);
  const parsed = termLevelSchema.safeParse(read(formData));
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!levelId.success || !parsed.success) return { error: locale === "fa" ? "اطلاعات سطح را بررسی کنید." : "Review the level information.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  try {
    const changed = await getDatabase().update(termLevels).set({ titleFa: parsed.data.titleFa, titleEn: parsed.data.titleEn || null, descriptionFa: parsed.data.descriptionFa || null, descriptionEn: parsed.data.descriptionEn || null, updatedAt: new Date() }).where(eq(termLevels.id, levelId.data)).returning({ id: termLevels.id });
    if (!changed.length) return { error: locale === "fa" ? "سطح پیدا نشد." : "The level was not found." };
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "سطحی با این عنوان وجود دارد." : "A level with this title already exists." };
    return { error: locale === "fa" ? "سطح به‌روزرسانی نشد." : "The level could not be updated." };
  }
  refresh();
  redirect("/panel/admin/term-levels?toast=updated");
}

export async function deleteTermLevel(levelIdValue: string, locale: "fa" | "en"): Promise<TermLevelMutationState> {
  await requireRole("admin");
  const levelId = z.uuid().safeParse(levelIdValue);
  if (!levelId.success) return { error: locale === "fa" ? "شناسه سطح معتبر نیست." : "The level identifier is invalid." };
  try {
    const removed = await getDatabase().delete(termLevels).where(eq(termLevels.id, levelId.data)).returning({ id: termLevels.id });
    if (!removed.length) return { error: locale === "fa" ? "سطح پیدا نشد." : "The level was not found." };
  } catch (error) {
    if (hasPostgresErrorCode(error, "23503")) return { error: locale === "fa" ? "این سطح در یک یا چند ترم استفاده شده و قابل حذف نیست." : "This level is used by one or more terms and cannot be deleted." };
    return { error: locale === "fa" ? "سطح حذف نشد." : "The level could not be deleted." };
  }
  refresh();
  return { success: locale === "fa" ? "سطح حذف شد." : "Level deleted." };
}
