"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  avatarUrl: z.string().trim().refine((value) => !value || value.startsWith("/media/avatar/")),
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
    name: formData.get("name"),
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

  await getDatabase()
    .update(users)
    .set({
      name: parsed.data.name,
      avatarUrl: parsed.data.avatarUrl || null,
      bioFa: parsed.data.bioFa || null,
      bioEn: parsed.data.bioEn || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/panel", "layout");
  redirect("/panel/profile?updated=1");
}
