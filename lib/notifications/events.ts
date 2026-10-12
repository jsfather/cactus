import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { notifications, users } from "@/lib/db/schema";
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
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.isActive, true)));
  if (admins.length)
    await db
      .insert(notifications)
      .values(admins.map((user) => ({ ...message, userId: user.id })));
}
