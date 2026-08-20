import { asc, and, eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { users, type UserRole } from "@/lib/db/schema";

const managedUserSelection = {
  id: users.id,
  email: users.email,
  name: users.name,
  role: users.role,
  isActive: users.isActive,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export function getUsersByRole(role: UserRole) {
  return getDatabase()
    .select(managedUserSelection)
    .from(users)
    .where(eq(users.role, role))
    .orderBy(asc(users.name), asc(users.createdAt));
}

export async function getManagedUser(userId: string, role: UserRole) {
  const [user] = await getDatabase()
    .select(managedUserSelection)
    .from(users)
    .where(and(eq(users.id, userId), eq(users.role, role)))
    .limit(1);

  return user ?? null;
}
