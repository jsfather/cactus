"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { getDatabase } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getAuthDictionary } from "@/lib/i18n/auth";
import { isLocale, localizePath } from "@/lib/i18n/config";
import { getPreferredLocale } from "@/lib/i18n/server";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type LoginState = {
  error?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const requestedLocale = formData.get("locale");
  const localeValue = typeof requestedLocale === "string" ? requestedLocale : null;
  const locale = isLocale(localeValue) ? localeValue : "fa";
  const dictionary = getAuthDictionary(locale);

  if (!parsed.success) {
    return { error: dictionary.invalidCredentials };
  }

  const [user] = await getDatabase()
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.email, parsed.data.email.toLowerCase()))
    .limit(1);

  if (
    !user ||
    !user.isActive ||
    !(await verifyPassword(parsed.data.password, user.passwordHash))
  ) {
    return { error: dictionary.invalidCredentials };
  }

  await createSession(user.id);
  redirect("/panel");
}

export async function logout() {
  const locale = await getPreferredLocale();
  await deleteSession();
  redirect(localizePath(locale, "/"));
}
