"use client";

import { useTransition } from "react";
import { deleteOwnComment } from "@/app/comment-actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import type { Locale } from "@/lib/i18n/config";
export function DeleteOwnCommentButton({ commentId, targetType, slug, locale }: { commentId: string; targetType: "post" | "product"; slug: string; locale: Locale }) { const [pending, startTransition] = useTransition(); const { confirm, toast } = useFeedback(); const isFa = locale === "fa"; async function remove() { const ok = await confirm({ title: isFa ? "حذف دیدگاه؟" : "Delete comment?", description: isFa ? "دیدگاه شما برای همیشه حذف می‌شود." : "Your comment will be permanently deleted.", confirmLabel: isFa ? "حذف" : "Delete" }); if (!ok) return; startTransition(async () => { const result = await deleteOwnComment(commentId, targetType, slug, locale); if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success); }); } return <button type="button" disabled={pending} onClick={remove} className="cursor-pointer text-xs font-medium text-red-600 disabled:opacity-50 dark:text-red-400">{pending ? (isFa ? "در حال حذف…" : "Deleting…") : (isFa ? "حذف دیدگاه من" : "Delete my comment")}</button>; }
