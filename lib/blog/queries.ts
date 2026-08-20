import { and, desc, eq, isNotNull, lte } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { posts, users } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

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
    publishedAt: posts.publishedAt,
    authorName: locale === "fa" ? users.nameFa : users.nameEn,
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
        locale === "en" ? isNotNull(posts.titleEn) : undefined,
        locale === "en" ? isNotNull(posts.excerptEn) : undefined,
        locale === "en" ? isNotNull(posts.contentEn) : undefined,
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
        locale === "en" ? isNotNull(posts.titleEn) : undefined,
        locale === "en" ? isNotNull(posts.excerptEn) : undefined,
        locale === "en" ? isNotNull(posts.contentEn) : undefined,
      ),
    )
    .limit(1);

  return post ?? null;
}

export async function getAdminPosts(locale: Locale) {
  return getDatabase()
    .select({
      id: posts.id,
      slug: posts.slug,
      titleFa: posts.titleFa,
      titleEn: posts.titleEn,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      authorName: locale === "fa" ? users.nameFa : users.nameEn,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.updatedAt));
}

export async function getAdminPost(postId: string) {
  const [post] = await getDatabase()
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  return post ?? null;
}
