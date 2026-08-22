"use server";

import { and, eq, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { comments, posts, products } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

const commentSchema = z.object({ body: z.string().trim().min(2).max(2000), locale: z.enum(["fa", "en"]) });
export type CommentFormState = { error?: string; success?: string; fieldErrors?: Record<string, string[]> };
export type CommentMutationState = { error?: string; success?: string };

export async function createComment(targetType: "post" | "product", targetIdValue: string, slug: string, _state: CommentFormState, formData: FormData): Promise<CommentFormState> {
  const user = await requireUser(); const targetId = z.uuid().safeParse(targetIdValue); const parsed = commentSchema.safeParse({ body: formData.get("body"), locale: formData.get("locale") }); const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!targetId.success || !parsed.success) return { error: locale === "fa" ? "متن دیدگاه را بررسی کنید." : "Please review your comment.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  const database = getDatabase(); const [target] = targetType === "post" ? await database.select({ id: posts.id }).from(posts).where(and(eq(posts.id, targetId.data), eq(posts.status, "published"), lte(posts.publishedAt, new Date()))).limit(1) : await database.select({ id: products.id }).from(products).where(and(eq(products.id, targetId.data), eq(products.status, "published"), lte(products.publishedAt, new Date()))).limit(1);
  if (!target) return { error: locale === "fa" ? "این محتوا دیگر در دسترس نیست." : "This content is no longer available." };
  try { await database.insert(comments).values({ postId: targetType === "post" ? target.id : null, productId: targetType === "product" ? target.id : null, authorId: user.id, authorNameFa: `${user.firstNameFa} ${user.lastNameFa}`, authorNameEn: `${user.firstNameEn} ${user.lastNameEn}`, body: parsed.data.body, status: "pending" }); } catch { return { error: locale === "fa" ? "ثبت دیدگاه انجام نشد." : "Your comment could not be submitted." }; }
  revalidatePath(`${locale === "en" ? "/en" : ""}/${targetType === "post" ? "blog" : "shop"}/${slug}`);
  revalidatePath("/panel/admin/comments");
  return { success: locale === "fa" ? "دیدگاه شما ثبت شد و پس از تأیید نمایش داده می‌شود." : "Your comment was submitted and will appear after approval." };
}

export async function deleteOwnComment(commentIdValue: string, targetType: "post" | "product", slug: string, locale: Locale): Promise<CommentMutationState> {
  const user = await requireUser(); const commentId = z.uuid().safeParse(commentIdValue); if (!commentId.success) return { error: locale === "fa" ? "شناسه دیدگاه معتبر نیست." : "The comment identifier is invalid." };
  try { const removed = await getDatabase().delete(comments).where(and(eq(comments.id, commentId.data), eq(comments.authorId, user.id))).returning({ id: comments.id }); if (!removed.length) return { error: locale === "fa" ? "دیدگاه پیدا نشد." : "The comment was not found." }; } catch { return { error: locale === "fa" ? "حذف دیدگاه انجام نشد." : "The comment could not be deleted." }; }
  revalidatePath(`${locale === "en" ? "/en" : ""}/${targetType === "post" ? "blog" : "shop"}/${slug}`); revalidatePath("/panel/admin/comments"); return { success: locale === "fa" ? "دیدگاه حذف شد." : "Comment deleted." };
}
