"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { comments } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

export type AdminCommentState = { error?: string; success?: string };
export async function moderateComment(commentIdValue: string, statusValue: "approved" | "rejected", locale: Locale): Promise<AdminCommentState> { const admin = await requireRole("admin"); const commentId = z.uuid().safeParse(commentIdValue); const status = z.enum(["approved", "rejected"]).safeParse(statusValue); if (!commentId.success || !status.success) return { error: locale === "fa" ? "درخواست معتبر نیست." : "The request is invalid." }; try { const changed = await getDatabase().update(comments).set({ status: status.data, moderatedById: admin.id, moderatedAt: new Date(), updatedAt: new Date() }).where(eq(comments.id, commentId.data)).returning({ id: comments.id }); if (!changed.length) return { error: locale === "fa" ? "دیدگاه پیدا نشد." : "The comment was not found." }; } catch { return { error: locale === "fa" ? "به‌روزرسانی دیدگاه انجام نشد." : "The comment could not be updated." }; } revalidatePath("/panel/admin/comments"); revalidatePath("/blog", "layout"); revalidatePath("/shop", "layout"); return { success: status.data === "approved" ? (locale === "fa" ? "دیدگاه تأیید شد." : "Comment approved.") : (locale === "fa" ? "دیدگاه رد شد." : "Comment rejected.") }; }
export async function deleteComment(commentIdValue: string, locale: Locale): Promise<AdminCommentState> { await requireRole("admin"); const commentId = z.uuid().safeParse(commentIdValue); if (!commentId.success) return { error: locale === "fa" ? "شناسه دیدگاه معتبر نیست." : "The comment identifier is invalid." }; try { const removed = await getDatabase().delete(comments).where(eq(comments.id, commentId.data)).returning({ id: comments.id }); if (!removed.length) return { error: locale === "fa" ? "دیدگاه پیدا نشد." : "The comment was not found." }; } catch { return { error: locale === "fa" ? "حذف دیدگاه انجام نشد." : "The comment could not be deleted." }; } revalidatePath("/panel/admin/comments"); revalidatePath("/blog", "layout"); revalidatePath("/shop", "layout"); return { success: locale === "fa" ? "دیدگاه حذف شد." : "Comment deleted." }; }
