"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { isAllowedImageReference } from "@/lib/media/reference";

const profileSchema = z.object({
  firstNameFa: z.string().trim().min(1).max(80),
  lastNameFa: z.string().trim().min(1).max(80),
  firstNameEn: z.string().trim().min(1).max(80),
  lastNameEn: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  avatarUrl: z.string().trim().max(2048).refine(isAllowedImageReference),
  bioFa: z.string().trim().max(1200),
  bioEn: z.string().trim().max(1200),
  locale: z.enum(["fa", "en"]),
});

export type ProfileFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    firstNameFa: formData.get("firstNameFa"),
    lastNameFa: formData.get("lastNameFa"),
    firstNameEn: formData.get("firstNameEn"),
    lastNameEn: formData.get("lastNameEn"),
    email: formData.get("email"),
    avatarUrl: formData.get("avatarUrl"),
    bioFa: formData.get("bioFa"),
    bioEn: formData.get("bioEn"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    const locale = formData.get("locale") === "en" ? "en" : "fa";
    return {
      error: locale === "fa" ? "لطفاً اطلاعات پروفایل را بررسی کنید." : "Please review your profile information.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await getDatabase()
      .update(users)
      .set({
        firstNameFa: parsed.data.firstNameFa,
        lastNameFa: parsed.data.lastNameFa,
        firstNameEn: parsed.data.firstNameEn,
        lastNameEn: parsed.data.lastNameEn,
        email: parsed.data.email.toLowerCase(),
        avatarUrl: parsed.data.avatarUrl || null,
        bioFa: parsed.data.bioFa || null,
        bioEn: parsed.data.bioEn || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: parsed.data.locale === "en" ? "This email is already used by another account." : "این ایمیل قبلاً برای حساب دیگری ثبت شده است.", fieldErrors: { email: [parsed.data.locale === "en" ? "Choose another email address." : "ایمیل دیگری انتخاب کنید."] } };
    }
    throw error;
  }

  revalidatePath("/panel", "layout");
  redirect("/panel/profile?updated=1");
}
