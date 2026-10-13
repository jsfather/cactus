"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { appSettings } from "@/lib/db/schema";
import { navigationSchema, defaultNavigation } from "./navigation";
import { saved, failed, validationError, type ActionState } from "@/lib/workflows";

export async function saveSeo(_state: ActionState, form: FormData): Promise<ActionState> {
  await requireRole("admin", "seo");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = navigationSchema.pick({ siteTitleFa: true, siteTitleEn: true, descriptionFa: true, descriptionEn: true, googleVerification: true }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    await getDatabase().transaction(async (tx) => {
      const [record] = await tx.select().from(appSettings).where(eq(appSettings.key, "site.navigation")).for("update");
      const current = record ? navigationSchema.parse(JSON.parse(record.value)) : defaultNavigation;
      const value = JSON.stringify({ ...current, ...parsed.data });
      await tx.insert(appSettings).values({ key: "site.navigation", value }).onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: new Date() } });
    });
    revalidatePath("/", "layout"); revalidatePath("/panel", "layout"); return saved(locale);
  } catch { return failed(locale); }
}
