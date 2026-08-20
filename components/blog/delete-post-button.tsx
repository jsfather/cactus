"use client";

import { useTransition } from "react";
import { deletePost } from "@/app/(panel)/panel/admin/blog/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { dangerButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeletePostButton({ postId, locale }: { postId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  const remove = async () => {
    const approved = await confirm({
      title: isFa ? "حذف نوشته؟" : "Delete post?",
      description: isFa ? "این نوشته برای همیشه حذف می‌شود و این عملیات قابل بازگشت نیست." : "This post will be permanently deleted. This action cannot be undone.",
      confirmLabel: isFa ? "حذف نوشته" : "Delete post",
    });
    if (!approved) return;

    startTransition(async () => {
      try {
        const result = await deletePost(postId, locale);
        if (result.error) toast.error(result.error);
        else if (result.success) toast.success(result.success);
      } catch {
        toast.error(isFa ? "حذف نوشته انجام نشد." : "The post could not be deleted.");
      }
    });
  };

  return <button type="button" disabled={pending} onClick={remove} className={dangerButtonClass}>{pending ? (isFa ? "در حال حذف…" : "Deleting…") : (isFa ? "حذف" : "Delete")}</button>;
}
