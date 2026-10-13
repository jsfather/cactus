import { getSafeReturnTo } from "./return-to";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db/client";
import { sessions, users, loginEvents, accessProfiles, type UserRole } from "@/lib/db/schema";
import { isAdministrator, type Permission } from "./permissions";

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
  accessProfileId?: string | null;
  permissions?: string[];
  accessTitleFa?: string | null;
  accessTitleEn?: string | null;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  method: "otp" | "password" | "registration",
) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await getDatabase().transaction(async (tx) => {
    await tx
      .insert(sessions)
      .values({ tokenHash: hashToken(token), userId, expiresAt });
    await tx.insert(loginEvents).values({ userId, method });
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
      accessProfileId: users.accessProfileId,
      permissions: accessProfiles.permissions,
      accessTitleFa: accessProfiles.titleFa,
      accessTitleEn: accessProfiles.titleEn,
      avatarUrl: users.avatarUrl,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .leftJoin(accessProfiles, eq(users.accessProfileId, accessProfiles.id))
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
        permissions: result.permissions ?? [],
        profileComplete: Boolean(
          result.firstNameFa.trim() && result.lastNameFa.trim(),
        ),
      }
    : null;
});

export async function requireUser(returnTo?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const safe = getSafeReturnTo(returnTo);
    redirect(safe ? `/login?returnTo=${encodeURIComponent(safe)}` : "/login");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole | UserRole[], permission?: Permission) {
  const user = await requireUser();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!user.profileComplete) {
    redirect("/panel/profile?onboarding=1");
  }

  if (!roles.includes(user.role)) {
    redirect(`/panel/${user.role}`);
  }

  if (user.role === "admin" && !isAdministrator(user, permission)) redirect("/panel/admin?access=denied");

  return user;
}

export async function requireAdminWorkspace() {
  const user = await requireUser();
  if (!user.profileComplete) redirect("/panel/profile?onboarding=1");
  if (user.role !== "admin") redirect(`/panel/${user.role}`);
  return user;
}
