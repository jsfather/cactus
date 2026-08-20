import { desc, gte, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { mediaAssets, posts, products, users, type UserRole } from "@/lib/db/schema";

export type DashboardActivity = {
  id: string;
  kind: "user" | "post" | "product";
  titleFa: string;
  titleEn: string;
  createdAt: Date;
  href: string;
};

export async function getAdminAnalytics() {
  const database = getDatabase();
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 6);

  const [[userStats], roleRows, [postStats], [productStats], [mediaStats], recentUsers, recentPosts, recentProducts, newUsers, newPosts, newProducts] = await Promise.all([
    database.select({ total: sql<number>`count(*)::int`, active: sql<number>`count(*) filter (where ${users.isActive} = true)::int` }).from(users),
    database.select({ role: users.role, count: sql<number>`count(*)::int` }).from(users).groupBy(users.role),
    database.select({ total: sql<number>`count(*)::int`, published: sql<number>`count(*) filter (where ${posts.status} = 'published')::int`, draft: sql<number>`count(*) filter (where ${posts.status} = 'draft')::int` }).from(posts),
    database.select({ total: sql<number>`count(*)::int`, published: sql<number>`count(*) filter (where ${products.status} = 'published')::int`, draft: sql<number>`count(*) filter (where ${products.status} = 'draft')::int`, lowStock: sql<number>`count(*) filter (where ${products.status} = 'published' and ${products.inventory} <= 5)::int` }).from(products),
    database.select({ total: sql<number>`count(*)::int` }).from(mediaAssets),
    database.select({ id: users.id, firstNameFa: users.firstNameFa, lastNameFa: users.lastNameFa, firstNameEn: users.firstNameEn, lastNameEn: users.lastNameEn, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(5),
    database.select({ id: posts.id, titleFa: posts.titleFa, titleEn: posts.titleEn, createdAt: posts.createdAt }).from(posts).orderBy(desc(posts.createdAt)).limit(5),
    database.select({ id: products.id, titleFa: products.titleFa, titleEn: products.titleEn, createdAt: products.createdAt }).from(products).orderBy(desc(products.createdAt)).limit(5),
    database.select({ createdAt: users.createdAt }).from(users).where(gte(users.createdAt, start)),
    database.select({ createdAt: posts.createdAt }).from(posts).where(gte(posts.createdAt, start)),
    database.select({ createdAt: products.createdAt }).from(products).where(gte(products.createdAt, start)),
  ]);

  const roles = Object.fromEntries(((["admin", "teacher", "student", "member"] as UserRole[]).map((role) => [role, roleRows.find((row) => row.role === role)?.count ?? 0]))) as Record<UserRole, number>;
  const recentActivity: DashboardActivity[] = [
    ...recentUsers.map((user) => ({ id: user.id, kind: "user" as const, titleFa: `${user.firstNameFa} ${user.lastNameFa}`.trim(), titleEn: `${user.firstNameEn} ${user.lastNameEn}`.trim(), createdAt: user.createdAt, href: `/panel/admin/${user.role === "admin" ? "admins" : user.role === "teacher" ? "teachers" : user.role === "student" ? "students" : "members"}/${user.id}/edit` })),
    ...recentPosts.map((post) => ({ id: post.id, kind: "post" as const, titleFa: post.titleFa, titleEn: post.titleEn || post.titleFa, createdAt: post.createdAt, href: `/panel/admin/blog/${post.id}/edit` })),
    ...recentProducts.map((product) => ({ id: product.id, kind: "product" as const, titleFa: product.titleFa, titleEn: product.titleEn || product.titleFa, createdAt: product.createdAt, href: `/panel/admin/products/${product.id}/edit` })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 7);

  const countByDate = (dates: Array<{ createdAt: Date }>) => {
    const counts = new Map<string, number>();
    for (const item of dates) {
      const key = item.createdAt.toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  };
  const userDates = countByDate(newUsers);
  const postDates = countByDate(newPosts);
  const productDates = countByDate(newProducts);
  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { date, users: userDates.get(key) ?? 0, posts: postDates.get(key) ?? 0, products: productDates.get(key) ?? 0 };
  });

  return {
    users: { total: userStats?.total ?? 0, active: userStats?.active ?? 0, roles },
    posts: { total: postStats?.total ?? 0, published: postStats?.published ?? 0, draft: postStats?.draft ?? 0 },
    products: { total: productStats?.total ?? 0, published: productStats?.published ?? 0, draft: productStats?.draft ?? 0, lowStock: productStats?.lowStock ?? 0 },
    media: mediaStats?.total ?? 0,
    activity,
    recentActivity,
  };
}
