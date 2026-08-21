import { asc, and, eq, ilike, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { users, type UserRole } from "@/lib/db/schema";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
  type AdminListQuery,
  type PaginatedResult,
} from "@/lib/panel/pagination";

const managedUserSelection = {
  id: users.id,
  email: users.email,
  firstNameFa: users.firstNameFa,
  lastNameFa: users.lastNameFa,
  firstNameEn: users.firstNameEn,
  lastNameEn: users.lastNameEn,
  role: users.role,
  isActive: users.isActive,
  avatarUrl: users.avatarUrl,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export type UserStatusFilter = "all" | "active" | "inactive";

export async function getUsersByRole(
  role: UserRole,
  query: AdminListQuery & { status: UserStatusFilter },
): Promise<PaginatedResult<{
  id: string;
  email: string;
  firstNameFa: string;
  lastNameFa: string;
  firstNameEn: string;
  lastNameEn: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}>> {
  const database = getDatabase();
  const pattern = `%${escapeLikePattern(query.q)}%`;
  const where = and(
    eq(users.role, role),
    query.status === "active"
      ? eq(users.isActive, true)
      : query.status === "inactive"
        ? eq(users.isActive, false)
        : undefined,
    query.q
      ? or(
          ilike(users.email, pattern),
          ilike(users.firstNameFa, pattern),
          ilike(users.lastNameFa, pattern),
          ilike(users.firstNameEn, pattern),
          ilike(users.lastNameEn, pattern),
          sql`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa}) ILIKE ${pattern}`,
          sql`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn}) ILIKE ${pattern}`,
        )
      : undefined,
  );
  const [{ total }] = await database
    .select({ total: sql<number>`count(*)::int` })
    .from(users)
    .where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await database
    .select(managedUserSelection)
    .from(users)
    .where(where)
    .orderBy(asc(users.firstNameFa), asc(users.lastNameFa), asc(users.createdAt))
    .limit(ADMIN_PAGE_SIZE)
    .offset((page - 1) * ADMIN_PAGE_SIZE);

  return { items, page, pageCount, pageSize: ADMIN_PAGE_SIZE, total };
}

export async function getManagedUser(userId: string, role: UserRole) {
  const [user] = await getDatabase()
    .select(managedUserSelection)
    .from(users)
    .where(and(eq(users.id, userId), eq(users.role, role)))
    .limit(1);

  return user ?? null;
}
