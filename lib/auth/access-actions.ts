"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { permissionSections } from "./permissions";
import { accessProfiles } from "@/lib/db/schema";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { saved, failed, denied, validationError, type ActionState } from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";

export async function saveAccessProfile(id: string | null, _state: ActionState, form: FormData): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  if (id && !z.uuid().safeParse(id).success) return denied(locale);
  const parsed = z.object({ titleFa: z.string().trim().min(2).max(160), titleEn: z.string().trim().min(2).max(160), permissions: z.array(z.enum(permissionSections.map((section) => section.key))).max(permissionSections.length) }).safeParse({ titleFa: form.get("titleFa"), titleEn: form.get("titleEn"), permissions: form.getAll("permissions") });
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    const data = { ...parsed.data, permissions: [...new Set(parsed.data.permissions)] };
    if (id) { const result = await getDatabase().update(accessProfiles).set(data).where(eq(accessProfiles.id, id)).returning({ id: accessProfiles.id }); if (!result.length) return denied(locale); }
    else await getDatabase().insert(accessProfiles).values(data);
    revalidatePath("/panel", "layout");
    return saved(locale);
  } catch { return failed(locale); }
}
export async function deleteAccessProfile(id: string, locale: Locale): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  try {
    await getDatabase().delete(accessProfiles).where(eq(accessProfiles.id, id));
    revalidatePath("/panel", "layout"); return saved(locale);
  } catch (error) {
    if (hasPostgresErrorCode(error, "23503")) return { error: locale === "fa" ? "این عنوان به همکاران اختصاص دارد؛ ابتدا عنوان دسترسی آن‌ها را تغییر دهید." : "This profile is assigned to colleagues. Reassign them before deleting it." };
    return failed(locale);
  }
}
