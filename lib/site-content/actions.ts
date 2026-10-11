"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { siteContent } from "@/lib/db/schema";
import { defaultSiteContent } from "./queries";
import { presentationSchema } from "./presentation";
import { validationError, saved, text, type ActionState } from "@/lib/workflows";
export async function savePresentation(_state: ActionState, form: FormData): Promise<ActionState> {
  const admin = await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = presentationSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    await getDatabase().insert(siteContent).values({ ...defaultSiteContent, presentation: parsed.data, updatedById: admin.id }).onConflictDoUpdate({ target: siteContent.key, set: { presentation: parsed.data, updatedById: admin.id, updatedAt: new Date() } });
  } catch { return { error: text(locale, "ذخیره تنظیمات انجام نشد.", "Could not save page settings.") }; }
  revalidatePath("/", "layout");
  return saved(locale);
}
