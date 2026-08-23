import { and, desc, eq, ilike, lte, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { honors } from "@/lib/db/schema";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
  type AdminListQuery,
  type PaginatedResult,
} from "@/lib/panel/pagination";

const publicSelection = {
  id: honors.id,
  slug: honors.slug,
  titleFa: honors.titleFa,
  titleEn: honors.titleEn,
  descriptionFa: honors.descriptionFa,
  descriptionEn: honors.descriptionEn,
  organizationFa: honors.organizationFa,
  organizationEn: honors.organizationEn,
  locationFa: honors.locationFa,
  locationEn: honors.locationEn,
  categoriesFa: honors.categoriesFa,
  categoriesEn: honors.categoriesEn,
  certificateImageUrl: honors.certificateImageUrl,
  issuedAt: honors.issuedAt,
  publishedAt: honors.publishedAt,
  updatedAt: honors.updatedAt,
};

export async function getPublishedHonors(limit?: number) {
  const query = getDatabase()
    .select(publicSelection)
    .from(honors)
    .where(and(eq(honors.status, "published"), lte(honors.publishedAt, new Date())))
    .orderBy(desc(honors.issuedAt), desc(honors.publishedAt));
  return limit ? query.limit(limit) : query;
}

export async function getPublishedHonor(slug: string) {
  const [honor] = await getDatabase()
    .select(publicSelection)
    .from(honors)
    .where(and(eq(honors.slug, slug), eq(honors.status, "published"), lte(honors.publishedAt, new Date())))
    .limit(1);
  return honor ?? null;
}

export type HonorStatusFilter = "all" | "draft" | "published";

export async function getAdminHonors(query: AdminListQuery & { status: HonorStatusFilter }): Promise<PaginatedResult<{
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string | null;
  organizationFa: string;
  organizationEn: string | null;
  issuedAt: string;
  status: "draft" | "published";
  updatedAt: Date;
}>> {
  const database = getDatabase();
  const pattern = `%${escapeLikePattern(query.q)}%`;
  const where = and(
    query.status === "draft" ? eq(honors.status, "draft") : query.status === "published" ? eq(honors.status, "published") : undefined,
    query.q ? or(
      ilike(honors.slug, pattern),
      ilike(honors.titleFa, pattern),
      ilike(honors.titleEn, pattern),
      ilike(honors.organizationFa, pattern),
      ilike(honors.organizationEn, pattern),
      sql`array_to_string(${honors.categoriesFa}, ' ') ILIKE ${pattern}`,
      sql`array_to_string(${honors.categoriesEn}, ' ') ILIKE ${pattern}`,
    ) : undefined,
  );
  const [{ total }] = await database.select({ total: sql<number>`count(*)::int` }).from(honors).where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await database.select({
    id: honors.id,
    slug: honors.slug,
    titleFa: honors.titleFa,
    titleEn: honors.titleEn,
    organizationFa: honors.organizationFa,
    organizationEn: honors.organizationEn,
    issuedAt: honors.issuedAt,
    status: honors.status,
    updatedAt: honors.updatedAt,
  }).from(honors).where(where).orderBy(desc(honors.updatedAt)).limit(ADMIN_PAGE_SIZE).offset((page - 1) * ADMIN_PAGE_SIZE);
  return { items, page, pageCount, pageSize: ADMIN_PAGE_SIZE, total };
}

export async function getAdminHonor(id: string) {
  const [honor] = await getDatabase().select().from(honors).where(eq(honors.id, id)).limit(1);
  return honor ?? null;
}
