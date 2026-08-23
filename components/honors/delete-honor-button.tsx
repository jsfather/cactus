"use client";

import { useTransition } from "react";
import { deleteHonor } from "@/app/(panel)/panel/admin/honors/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteHonorButton({ honorId, locale }: { honorId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";
  async function remove() {
    const approved = await confirm({ title: isFa ? "حذف افتخار یا گواهینامه؟" : "Delete honor or certificate?", description: isFa ? "این مورد برای همیشه حذف می‌شود و صفحه عمومی آن نیز از دسترس خارج خواهد شد." : "This item will be permanently deleted and its public page will become unavailable.", confirmLabel: isFa ? "حذف" : "Delete" });
    if (!approved) return;
    startTransition(async () => {
      try {
        const result = await deleteHonor(honorId, locale);
        if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success);
      } catch { toast.error(isFa ? "حذف انجام نشد." : "The item could not be deleted."); }
    });
  }
  return <PanelTableActionButton label={pending ? (isFa ? "در حال حذف…" : "Deleting…") : (isFa ? "حذف" : "Delete")} tone="danger" disabled={pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
