"use client";

import { useTransition } from "react";
import { deleteMediaAsset } from "@/app/(panel)/panel/admin/media/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteMediaButton({ assetId, locale, redirectAfterDelete = false }: { assetId: string; locale: Locale; redirectAfterDelete?: boolean }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  const remove = async () => {
    const approved = await confirm({
      title: isFa ? "حذف رسانه؟" : "Delete media?",
      description: isFa ? "فایل و اطلاعات آن برای همیشه حذف می‌شوند. اگر تصویر در جایی استفاده شده باشد، حذف متوقف می‌شود." : "The file and its metadata will be permanently removed. Deletion is blocked while the image is in use.",
      confirmLabel: isFa ? "حذف رسانه" : "Delete media",
    });
    if (!approved) return;

    startTransition(async () => {
      try {
        const result = await deleteMediaAsset(assetId, locale, redirectAfterDelete);
        if (result.error) toast.error(result.error);
        else if (result.success) toast.success(result.success);
      } catch {
        toast.error(isFa ? "حذف رسانه انجام نشد." : "The media item could not be deleted.");
      }
    });
  };

  const label = pending ? (isFa ? "در حال حذف…" : "Deleting…") : (isFa ? "حذف رسانه" : "Delete media");
  return <PanelTableActionButton label={label} tone="danger" disabled={pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
