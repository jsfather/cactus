"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { appSettings } from "@/lib/db/schema";
import { appearanceSchema, colorTokens } from "./appearance";
import {
  failed,
  saved,
  validationError,
  type ActionState,
} from "@/lib/workflows";
export async function saveAppearance(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const palette = (mode: string) =>
    Object.fromEntries(
      colorTokens.map(([key]) => [key, form.get(`${mode}-${key}`)]),
    );
  const parsed = appearanceSchema.safeParse({
    ...Object.fromEntries(form),
    light: palette("light"),
    dark: palette("dark"),
  });
  if (!parsed.success) {
    const state = validationError(locale, parsed.error);
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "light" || issue.path[0] === "dark")
        state.fieldErrors![
          `${String(issue.path[0])}-${String(issue.path[1])}`
        ] = [state.error!];
    }
    return state;
  }
  try {
    await getDatabase()
      .insert(appSettings)
      .values({ key: "site.appearance", value: JSON.stringify(parsed.data) })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value: JSON.stringify(parsed.data), updatedAt: new Date() },
      });
  } catch {
    return failed(locale);
  }
  revalidatePath("/", "layout");
  return saved(locale);
}
