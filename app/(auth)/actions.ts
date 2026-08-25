"use server";

import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import { getSafeReturnTo } from "@/lib/auth/return-to";
import { createSession } from "@/lib/auth/session";
import { normalizeIranianMobile, normalizeOtpCode } from "@/lib/auth/mobile";
import { consumeOtp, requestOtp } from "@/lib/auth/otp";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { users, type OtpPurpose } from "@/lib/db/schema";
import { getAuthDictionary } from "@/lib/i18n/auth";
import { isLocale, type Locale } from "@/lib/i18n/config";

export type MobileAuthState = {
  step?: "verify";
  mobile?: string;
  purpose?: OtpPurpose;
  hasPassword?: boolean;
  developmentCode?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  attemptId?: string;
};

function readLocale(formData: FormData): Locale {
  const value = formData.get("locale");
  return typeof value === "string" && isLocale(value) ? value : "fa";
}

function readMobile(formData: FormData) {
  const value = formData.get("mobile");
  return normalizeIranianMobile(typeof value === "string" ? value : "");
}

function readReturnTo(formData: FormData) {
  return getSafeReturnTo(formData.get("returnTo"));
}

export async function requestAuthenticationOtp(
  previousState: MobileAuthState,
  formData: FormData,
): Promise<MobileAuthState> {
  const locale = readLocale(formData);
  const dictionary = getAuthDictionary(locale);
  const mobile = readMobile(formData);

  if (!mobile) {
    return { error: dictionary.invalidMobile, fieldErrors: { mobile: [dictionary.invalidMobile] } };
  }

  const [user] = await getDatabase()
    .select({ isActive: users.isActive, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.mobile, mobile))
    .limit(1);

  if (user && !user.isActive) {
    return { error: dictionary.inactiveAccount, mobile };
  }

  const purpose: OtpPurpose = user ? "login" : "register";
  const result = await requestOtp(mobile, purpose);
  if (!result.ok) {
    const keepVerification = previousState.step === "verify" &&
      previousState.mobile === mobile &&
      previousState.purpose === purpose;
    const stayOnVerification = result.reason === "rate_limited" || keepVerification;
    return {
      step: stayOnVerification ? "verify" : undefined,
      error: result.reason === "rate_limited" ? dictionary.rateLimited : dictionary.smsFailed,
      mobile,
      purpose,
      hasPassword: purpose === "login" && Boolean(user?.passwordHash),
      developmentCode:
        stayOnVerification
          ? previousState.developmentCode
          : undefined,
      attemptId: stayOnVerification ? randomUUID() : undefined,
    };
  }

  return {
    step: "verify",
    mobile,
    purpose,
    hasPassword: purpose === "login" && Boolean(user?.passwordHash),
    developmentCode: result.developmentCode,
    attemptId: randomUUID(),
  };
}

export async function verifyAuthenticationOtp(
  _previousState: MobileAuthState,
  formData: FormData,
): Promise<MobileAuthState> {
  const locale = readLocale(formData);
  const dictionary = getAuthDictionary(locale);
  const mobile = readMobile(formData);
  const rawCode = formData.get("code");
  const code = normalizeOtpCode(typeof rawCode === "string" ? rawCode : "");
  const parsedPurpose = z.enum(["login", "register"]).safeParse(formData.get("purpose"));

  if (!mobile || !code || !parsedPurpose.success) {
    return {
      step: parsedPurpose.success ? "verify" : undefined,
      mobile: mobile ?? undefined,
      purpose: parsedPurpose.success ? parsedPurpose.data : undefined,
      error: dictionary.invalidCode,
    };
  }

  const purpose = parsedPurpose.data;
  const [existingUser] = await getDatabase()
    .select({ id: users.id, isActive: users.isActive })
    .from(users)
    .where(eq(users.mobile, mobile))
    .limit(1);

  if (purpose === "login" && (!existingUser || !existingUser.isActive)) {
    return { error: existingUser ? dictionary.inactiveAccount : dictionary.accountChanged, mobile };
  }
  if (purpose === "register" && existingUser) {
    return { error: existingUser.isActive ? dictionary.accountChanged : dictionary.inactiveAccount, mobile };
  }

  if (!(await consumeOtp(mobile, purpose, code))) {
    return { step: "verify", mobile, purpose, error: dictionary.invalidCode };
  }

  if (purpose === "login") {
    await createSession(existingUser.id);
    redirect(readReturnTo(formData) || "/panel");
  }

  try {
    const [user] = await getDatabase()
      .insert(users)
      .values({
        mobile,
        email: null,
        firstNameFa: "",
        lastNameFa: "",
        firstNameEn: "",
        lastNameEn: "",
        passwordHash: null,
        role: "member",
        isActive: true,
      })
      .returning({ id: users.id });

    await createSession(user.id);
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: dictionary.accountChanged, mobile };
    }
    throw error;
  }

  redirect("/panel/profile?onboarding=1");
}

const passwordSchema = z.object({ password: z.string().min(1).max(256) });
const MAX_PASSWORD_ATTEMPTS = 5;
const PASSWORD_LOCK_MS = 15 * 60 * 1000;

export async function loginWithPassword(
  _previousState: MobileAuthState,
  formData: FormData,
): Promise<MobileAuthState> {
  const locale = readLocale(formData);
  const dictionary = getAuthDictionary(locale);
  const mobile = readMobile(formData);
  const parsed = passwordSchema.safeParse({ password: formData.get("password") });

  if (!mobile || !parsed.success) return { error: dictionary.invalidCredentials, mobile: mobile ?? undefined };

  const [user] = await getDatabase()
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
      passwordFailedAttempts: users.passwordFailedAttempts,
      passwordLockedUntil: users.passwordLockedUntil,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.mobile, mobile))
    .limit(1);

  if (!user?.isActive || !user.passwordHash) {
    return { step: "verify", mobile, purpose: "login", hasPassword: true, error: dictionary.invalidCredentials };
  }

  const now = new Date();
  if (user.passwordLockedUntil && user.passwordLockedUntil > now) {
    return { step: "verify", mobile, purpose: "login", hasPassword: true, error: dictionary.invalidCredentials };
  }

  if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
    const shouldLock = user.passwordFailedAttempts + 1 >= MAX_PASSWORD_ATTEMPTS;
    await getDatabase()
      .update(users)
      .set({
        passwordFailedAttempts: shouldLock ? 0 : sql`${users.passwordFailedAttempts} + 1`,
        passwordLockedUntil: shouldLock ? new Date(now.getTime() + PASSWORD_LOCK_MS) : null,
      })
      .where(eq(users.id, user.id));
    return { step: "verify", mobile, purpose: "login", hasPassword: true, error: dictionary.invalidCredentials };
  }

  if (user.passwordFailedAttempts || user.passwordLockedUntil) {
    await getDatabase()
      .update(users)
      .set({ passwordFailedAttempts: 0, passwordLockedUntil: null })
      .where(eq(users.id, user.id));
  }

  await createSession(user.id);
  redirect(readReturnTo(formData) || "/panel");
}
