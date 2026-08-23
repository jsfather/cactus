import "server-only";

import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { and, count, desc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { otpChallenges, type OtpPurpose } from "@/lib/db/schema";
import { sendAuthenticationCode } from "@/lib/auth/sms";

const OTP_TTL_MS = 2 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const OTP_WINDOW_MS = 15 * 60 * 1000;
const OTP_WINDOW_LIMIT = 5;
const OTP_MAX_ATTEMPTS = 5;

function getOtpSecret() {
  const secret = process.env.AUTH_OTP_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "cactus-development-otp-secret";
  throw new Error("AUTH_OTP_SECRET is required in production.");
}

function hashCode(challengeId: string, code: string) {
  return createHmac("sha256", getOtpSecret())
    .update(`${challengeId}:${code}`)
    .digest("hex");
}

function codeMatches(expectedHash: string, challengeId: string, code: string) {
  const expected = Buffer.from(expectedHash, "hex");
  const received = Buffer.from(hashCode(challengeId, code), "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export type OtpRequestResult =
  | { ok: true; developmentCode?: string }
  | { ok: false; reason: "rate_limited" | "delivery_failed" };

export async function requestOtp(
  mobile: string,
  purpose: OtpPurpose,
): Promise<OtpRequestResult> {
  const database = getDatabase();
  const now = new Date();
  const resendBoundary = new Date(now.getTime() - OTP_RESEND_MS);
  const windowBoundary = new Date(now.getTime() - OTP_WINDOW_MS);

  await database
    .delete(otpChallenges)
    .where(lt(otpChallenges.expiresAt, new Date(now.getTime() - 24 * 60 * 60 * 1000)));

  const [recent, [{ total }]] = await Promise.all([
    database
      .select({ id: otpChallenges.id })
      .from(otpChallenges)
      .where(
        and(
          eq(otpChallenges.mobile, mobile),
          eq(otpChallenges.purpose, purpose),
          gt(otpChallenges.createdAt, resendBoundary),
        ),
      )
      .limit(1),
    database
      .select({ total: count() })
      .from(otpChallenges)
      .where(
        and(
          eq(otpChallenges.mobile, mobile),
          gt(otpChallenges.createdAt, windowBoundary),
        ),
      ),
  ]);

  if (recent.length || (total ?? 0) >= OTP_WINDOW_LIMIT) {
    return { ok: false, reason: "rate_limited" };
  }

  const code = randomInt(100_000, 1_000_000).toString();
  const challengeId = randomUUID();
  await database.insert(otpChallenges).values({
    id: challengeId,
    mobile,
    purpose,
    codeHash: hashCode(challengeId, code),
    expiresAt: new Date(now.getTime() + OTP_TTL_MS),
  });

  try {
    const delivery = await sendAuthenticationCode(mobile, code);
    return { ok: true, developmentCode: delivery.developmentCode };
  } catch (error) {
    console.error("Authentication SMS delivery failed.", error instanceof Error ? error.message : "Unknown provider error");
    await database.delete(otpChallenges).where(eq(otpChallenges.id, challengeId));
    return { ok: false, reason: "delivery_failed" };
  }
}

export async function consumeOtp(
  mobile: string,
  purpose: OtpPurpose,
  code: string,
) {
  const database = getDatabase();
  const now = new Date();
  const [challenge] = await database
    .select()
    .from(otpChallenges)
    .where(
      and(
        eq(otpChallenges.mobile, mobile),
        eq(otpChallenges.purpose, purpose),
        isNull(otpChallenges.consumedAt),
        gt(otpChallenges.expiresAt, now),
      ),
    )
    .orderBy(desc(otpChallenges.createdAt))
    .limit(1);

  if (!challenge || challenge.attempts >= OTP_MAX_ATTEMPTS) return false;

  if (!codeMatches(challenge.codeHash, challenge.id, code)) {
    await database
      .update(otpChallenges)
      .set({ attempts: sql`${otpChallenges.attempts} + 1` })
      .where(and(eq(otpChallenges.id, challenge.id), lt(otpChallenges.attempts, OTP_MAX_ATTEMPTS)));
    return false;
  }

  const [consumed] = await database
    .update(otpChallenges)
    .set({ consumedAt: now })
    .where(and(eq(otpChallenges.id, challenge.id), isNull(otpChallenges.consumedAt)))
    .returning({ id: otpChallenges.id });

  return Boolean(consumed);
}
