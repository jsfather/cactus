"use server";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { appSettings, users } from "@/lib/db/schema";
import { isAllowedImageReference } from "@/lib/media/reference";
import { chatSettingsSchema } from "./settings";
import {
  validationError,
  saved,
  failed,
  denied,
  type ActionState,
} from "@/lib/workflows";
export async function saveChatSettings(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = chatSettingsSchema.safeParse({
    ...Object.fromEntries(form),
    workingDays: String(form.get("workingDays") ?? "")
      .split(",")
      .filter(Boolean),
    operatorIds: form.getAll("operatorIds"),
  });
  if (!parsed.success) return validationError(locale, parsed.error);
  if (parsed.data.logoUrl && !isAllowedImageReference(parsed.data.logoUrl))
    return denied(locale);
  try {
    const db = getDatabase();
    const people = parsed.data.operatorIds.length
      ? await db
          .select({ id: users.id })
          .from(users)
          .where(
            and(
              inArray(users.id, parsed.data.operatorIds),
              inArray(users.role, ["admin", "teacher"]),
              eq(users.isActive, true),
            ),
          )
      : [];
    if (people.length !== new Set(parsed.data.operatorIds).size)
      return denied(locale);
    await db
      .insert(appSettings)
      .values({ key: "support.live-chat", value: JSON.stringify(parsed.data) })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value: JSON.stringify(parsed.data), updatedAt: new Date() },
      });
    revalidatePath("/", "layout");
    return saved(locale);
  } catch {
    return failed(locale);
  }
}
