"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { siteContent, appSettings } from "@/lib/db/schema";
import { navigationSchema } from "./navigation";
import { defaultSiteContent } from "./queries";
import { presentationSchema } from "./presentation";
import {
  validationError,
  saved,
  text,
  type ActionState,
} from "@/lib/workflows";
export async function savePresentation(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireRole("admin", "settings");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const data = Object.fromEntries(form);
  try {
    data.testimonials = JSON.parse(String(form.get("testimonials") ?? "[]"));
  } catch {
    return {
      error: text(
        locale,
        "اطلاعات رضایت‌ها معتبر نیست.",
        "Testimonials are invalid.",
      ),
    };
  }
  const deadline = String(form.get("bannerDeadline") ?? "");
  data.bannerDeadline = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(
    deadline,
  )
    ? `${deadline.length === 16 ? `${deadline}:00` : deadline}+03:30`
    : deadline;
  for (const name of ["aboutVideos", "testimonialVideos"] as const) {
    data[name] = form.getAll(`${name}Url`).map(String).join("\n");
    data[
      name === "aboutVideos" ? "aboutVideoFrames" : "testimonialVideoFrames"
    ] = form.getAll(`${name}Frame`).map(String).join("\n") || "auto";
  }
  const parsed = presentationSchema.safeParse(data);
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    await getDatabase()
      .insert(siteContent)
      .values({
        ...defaultSiteContent,
        presentation: parsed.data,
        updatedById: admin.id,
      })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: {
          presentation: parsed.data,
          updatedById: admin.id,
          updatedAt: new Date(),
        },
      });
  } catch {
    return {
      error: text(
        locale,
        "ذخیره تنظیمات انجام نشد.",
        "Could not save page settings.",
      ),
    };
  }
  revalidatePath("/", "layout");
  return saved(locale);
}

export async function saveNavigation(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin", "settings");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  let links;
  try {
    links = {
      headerLinks: JSON.parse(String(form.get("headerLinks"))),
      footerLinks: JSON.parse(String(form.get("footerLinks"))),
      socialLinks: JSON.parse(String(form.get("socialLinks") ?? "[]")),
    };
  } catch {
    return {
      error: text(
        locale,
        "پیوندهای سایت معتبر نیستند.",
        "Site links are invalid.",
      ),
    };
  }
  const parsed = navigationSchema.safeParse({
    ...Object.fromEntries(form),
    ...links,
  });
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    await getDatabase()
      .insert(appSettings)
      .values({ key: "site.navigation", value: JSON.stringify(parsed.data) })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value: JSON.stringify(parsed.data), updatedAt: new Date() },
      });
  } catch {
    return {
      error: text(locale, "تنظیمات ذخیره نشد.", "Could not save settings."),
    };
  }
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/panel", "layout");
  revalidatePath("/login");
  revalidatePath("/join", "layout");
  return saved(locale);
}
