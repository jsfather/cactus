import "server-only";
import { cache } from "react";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { landingPages } from "@/lib/db/schema";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
  type AdminListQuery,
} from "@/lib/panel/pagination";
import { landingSlug } from "./validation";
export const getPublishedLanding = cache(async (slug: string) => {
  if (!landingSlug.safeParse(slug).success) return null;
  const [row] = await getDatabase()
    .select()
    .from(landingPages)
    .where(
      and(eq(landingPages.slug, slug), eq(landingPages.status, "published")),
    )
    .limit(1);
  return row ?? null;
});
export async function getAdminLandings(query: AdminListQuery) {
  const db = getDatabase(),
    pattern = `%${escapeLikePattern(query.q)}%`;
  const where = query.q
    ? or(
        ilike(landingPages.titleFa, pattern),
        ilike(landingPages.titleEn, pattern),
        ilike(landingPages.slug, pattern),
      )
    : undefined;
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(landingPages)
    .where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await db
    .select({
      id: landingPages.id,
      slug: landingPages.slug,
      titleFa: landingPages.titleFa,
      titleEn: landingPages.titleEn,
      status: landingPages.status,
    })
    .from(landingPages)
    .where(where)
    .orderBy(desc(landingPages.updatedAt))
    .limit(ADMIN_PAGE_SIZE)
    .offset((page - 1) * ADMIN_PAGE_SIZE);
  return { items, total, page, pageCount, pageSize: ADMIN_PAGE_SIZE };
}
