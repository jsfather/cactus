import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db/client";
import { sessions, users, type UserRole } from "@/lib/db/schema";

const SESSION_COOKIE = "cactus_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

export type CurrentUser = {
  id: string;
  mobile: string;
  email: string | null;
  firstNameFa: string;
  lastNameFa: string;
  firstNameEn: string;
  lastNameEn: string;
  role: UserRole;
  avatarUrl: string | null;
  profileComplete: boolean;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await getDatabase().insert(sessions).values({
    tokenHash: hashToken(token),
    userId,
    expiresAt,
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await getDatabase()
      .delete(sessions)
      .where(eq(sessions.tokenHash, hashToken(token)));
  }

  cookieStore.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const [result] = await getDatabase()
    .select({
      id: users.id,
      mobile: users.mobile,
      email: users.email,
      firstNameFa: users.firstNameFa,
      lastNameFa: users.lastNameFa,
      firstNameEn: users.firstNameEn,
      lastNameEn: users.lastNameEn,
      role: users.role,
      avatarUrl: users.avatarUrl,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
        eq(users.isActive, true),
      ),
    )
    .limit(1);

  return result
    ? {
        ...result,
        profileComplete: Boolean(result.firstNameFa.trim() && result.lastNameFa.trim()),
      }
    : null;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const user = await requireUser();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!user.profileComplete) {
    redirect("/panel/profile?onboarding=1");
  }

  if (!roles.includes(user.role)) {
    redirect(`/panel/${user.role}`);
  }

  return user;
}
