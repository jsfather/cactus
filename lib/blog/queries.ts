import { and, desc, eq, gt, ilike, lte, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { posts, users } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
  type AdminListQuery,
  type PaginatedResult,
} from "@/lib/panel/pagination";

function publicPostSelection(locale: Locale) {
  return {
    id: posts.id,
    slug: posts.slug,
    titleFa: posts.titleFa,
    titleEn: posts.titleEn,
    excerptFa: posts.excerptFa,
    excerptEn: posts.excerptEn,
    contentFa: posts.contentFa,
    contentEn: posts.contentEn,
    coverImageUrl: posts.coverImageUrl,
    tags: posts.tags,
    seoTitleFa: posts.seoTitleFa,
    seoTitleEn: posts.seoTitleEn,
    seoDescriptionFa: posts.seoDescriptionFa,
    seoDescriptionEn: posts.seoDescriptionEn,
    seoImageUrl: posts.seoImageUrl,
    canonicalUrl: posts.canonicalUrl,
    noIndex: posts.noIndex,
    publishedAt: posts.publishedAt,
    updatedAt: posts.updatedAt,
    authorName: locale === "fa"
      ? sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`
      : sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`,
  };
}

export async function getPublishedPosts(locale: Locale, limit?: number) {
  const query = getDatabase()
    .select(publicPostSelection(locale))
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(
      and(
        eq(posts.status, "published"),
        lte(posts.publishedAt, new Date()),
      ),
    )
    .orderBy(desc(posts.publishedAt));

  return limit ? query.limit(limit) : query;
}

export async function getPublishedPost(slug: string, locale: Locale) {
  const [post] = await getDatabase()
    .select(publicPostSelection(locale))
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(
      and(
        eq(posts.slug, slug),
        eq(posts.status, "published"),
        lte(posts.publishedAt, new Date()),
      ),
    )
    .limit(1);

  return post ?? null;
}

export type PostStatusFilter = "all" | "draft" | "published" | "scheduled";

export async function getAdminPosts(
  locale: Locale,
  query: AdminListQuery & { status: PostStatusFilter },
): Promise<PaginatedResult<{
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string | null;
  status: "draft" | "published";
  publishedAt: Date | null;
  updatedAt: Date;
  authorName: string;
}>> {
  const database = getDatabase();
  const now = new Date();
  const pattern = `%${escapeLikePattern(query.q)}%`;
  const statusCondition =
    query.status === "draft"
      ? eq(posts.status, "draft")
      : query.status === "published"
        ? and(eq(posts.status, "published"), lte(posts.publishedAt, now))
        : query.status === "scheduled"
          ? and(eq(posts.status, "published"), gt(posts.publishedAt, now))
          : undefined;
  const where = and(
    statusCondition,
    query.q
      ? or(
          ilike(posts.slug, pattern),
          ilike(posts.titleFa, pattern),
          ilike(posts.titleEn, pattern),
          sql`array_to_string(${posts.tags}, ' ') ILIKE ${pattern}`,
          sql`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa}) ILIKE ${pattern}`,
          sql`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn}) ILIKE ${pattern}`,
        )
      : undefined,
  );
  const [{ total }] = await database
    .select({ total: sql<number>`count(*)::int` })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await database
    .select({
      id: posts.id,
      slug: posts.slug,
      titleFa: posts.titleFa,
      titleEn: posts.titleEn,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      authorName: locale === "fa"
        ? sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`
        : sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(where)
    .orderBy(desc(posts.updatedAt))
    .limit(ADMIN_PAGE_SIZE)
    .offset((page - 1) * ADMIN_PAGE_SIZE);

  return { items, page, pageCount, pageSize: ADMIN_PAGE_SIZE, total };
}

export async function getAdminPost(postId: string) {
  const [post] = await getDatabase()
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  return post ?? null;
}
