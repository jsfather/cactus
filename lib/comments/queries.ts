import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { comments, posts, products, type CommentStatus } from "@/lib/db/schema";
import { ADMIN_PAGE_SIZE, escapeLikePattern, normalizePage, type AdminListQuery, type PaginatedResult } from "@/lib/panel/pagination";

export async function getContentComments(target: { postId?: string; productId?: string }, currentUserId?: string) {
  return getDatabase().select().from(comments).where(and(
    target.postId ? eq(comments.postId, target.postId) : eq(comments.productId, target.productId!),
    currentUserId ? or(eq(comments.status, "approved"), eq(comments.authorId, currentUserId)) : eq(comments.status, "approved"),
  )).orderBy(desc(comments.createdAt));
}

export type CommentStatusFilter = "all" | CommentStatus;
export type CommentTargetFilter = "all" | "blog" | "shop";
export async function getAdminComments(query: AdminListQuery & { status: CommentStatusFilter; target: CommentTargetFilter }): Promise<PaginatedResult<{
  id: string; body: string; status: CommentStatus; authorNameFa: string; authorNameEn: string; postId: string | null; productId: string | null; targetTitleFa: string | null; targetTitleEn: string | null; createdAt: Date;
}>> {
  const database = getDatabase(); const pattern = `%${escapeLikePattern(query.q)}%`;
  const where = and(query.status === "all" ? undefined : eq(comments.status, query.status), query.target === "blog" ? sql`${comments.postId} is not null` : query.target === "shop" ? sql`${comments.productId} is not null` : undefined, query.q ? or(ilike(comments.body, pattern), ilike(comments.authorNameFa, pattern), ilike(comments.authorNameEn, pattern), ilike(posts.titleFa, pattern), ilike(posts.titleEn, pattern), ilike(products.titleFa, pattern), ilike(products.titleEn, pattern)) : undefined);
  const [{ total }] = await database.select({ total: sql<number>`count(*)::int` }).from(comments).leftJoin(posts, eq(comments.postId, posts.id)).leftJoin(products, eq(comments.productId, products.id)).where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await database.select({ id: comments.id, body: comments.body, status: comments.status, authorNameFa: comments.authorNameFa, authorNameEn: comments.authorNameEn, postId: comments.postId, productId: comments.productId, targetTitleFa: sql<string | null>`coalesce(${posts.titleFa}, ${products.titleFa})`, targetTitleEn: sql<string | null>`coalesce(${posts.titleEn}, ${products.titleEn})`, createdAt: comments.createdAt }).from(comments).leftJoin(posts, eq(comments.postId, posts.id)).leftJoin(products, eq(comments.productId, products.id)).where(where).orderBy(desc(comments.createdAt)).limit(ADMIN_PAGE_SIZE).offset((page - 1) * ADMIN_PAGE_SIZE);
  return { items, page, pageCount, pageSize: ADMIN_PAGE_SIZE, total };
}
