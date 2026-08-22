"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { users } from "@/lib/db/schema";
import { getAuthDictionary } from "@/lib/i18n/auth";
import { isLocale } from "@/lib/i18n/config";

const registerSchema = z.object({
  firstNameFa: z.string().trim().min(1).max(80),
  lastNameFa: z.string().trim().min(1).max(80),
  firstNameEn: z.string().trim().min(1).max(80),
  lastNameEn: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(256),
  confirmPassword: z.string().min(1).max(256),
  locale: z.enum(["fa", "en"]),
}).superRefine((value, context) => {
  if (value.password !== value.confirmPassword) {
    context.addIssue({ code: "custom", path: ["confirmPassword"], message: getAuthDictionary(value.locale).passwordMismatch });
  }
});

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function register(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const requestedLocale = formData.get("locale");
  const locale = typeof requestedLocale === "string" && isLocale(requestedLocale) ? requestedLocale : "fa";
  const dictionary = getAuthDictionary(locale);
  const parsed = registerSchema.safeParse({
    firstNameFa: formData.get("firstNameFa"),
    lastNameFa: formData.get("lastNameFa"),
    firstNameEn: formData.get("firstNameEn"),
    lastNameEn: formData.get("lastNameEn"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    locale,
  });

  if (!parsed.success) {
    return { error: dictionary.registerFormError, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  let userId: string;
  try {
    const [createdUser] = await getDatabase().insert(users).values({
      firstNameFa: parsed.data.firstNameFa,
      lastNameFa: parsed.data.lastNameFa,
      firstNameEn: parsed.data.firstNameEn,
      lastNameEn: parsed.data.lastNameEn,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: "member",
      isActive: true,
    }).returning({ id: users.id });
    userId = createdUser.id;
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: dictionary.duplicateEmail, fieldErrors: { email: [dictionary.duplicateEmail] } };
    }
    throw error;
  }

  await createSession(userId);
  redirect("/panel/member");
}
