import "server-only";
import { and, eq, inArray, or, isNull, sql } from "drizzle-orm";
import { notifications, users, accessProfiles } from "@/lib/db/schema";
import { permissionForPath } from "@/lib/auth/permissions";
import type { getDatabase } from "@/lib/db/client";
type Writer = Pick<ReturnType<typeof getDatabase>, "insert" | "select">;
type Message = Pick<
  typeof notifications.$inferInsert,
  "titleFa" | "titleEn" | "bodyFa" | "bodyEn" | "href"
>;
export async function notifyUsers(
  db: Writer,
  ids: (string | null | undefined)[],
  message: Message,
) {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (!unique.length) return;
  const active = await db
    .select({ id: users.id })
    .from(users)
    .where(and(inArray(users.id, unique), eq(users.isActive, true)));
  if (active.length)
    await db
      .insert(notifications)
      .values(active.map((user) => ({ ...message, userId: user.id })));
}
export async function notifyAdmins(db: Writer, message: Message) {
  const permission = permissionForPath(message.href ?? "");
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .leftJoin(accessProfiles, eq(users.accessProfileId, accessProfiles.id))
    .where(and(eq(users.role, "admin"), eq(users.isActive, true), permission ? or(isNull(users.accessProfileId), sql`${accessProfiles.permissions} @> ${JSON.stringify([permission])}::jsonb`) : isNull(users.accessProfileId)));
  if (admins.length)
    await db
      .insert(notifications)
      .values(admins.map((user) => ({ ...message, userId: user.id })));
}
