"use client";

import { useTransition } from "react";
import { deleteTermLevel } from "@/app/(panel)/panel/admin/term-levels/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteTermLevelButton({ levelId, locale }: { levelId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";
  async function remove() {
    const approved = await confirm({ title: isFa ? "حذف سطح؟" : "Delete level?", description: isFa ? "اگر این سطح در ترمی استفاده شده باشد، حذف انجام نمی‌شود." : "Deletion will be blocked if a term uses this level.", confirmLabel: isFa ? "حذف سطح" : "Delete level" });
    if (!approved) return;
    startTransition(async () => { const result = await deleteTermLevel(levelId, locale); if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success); });
  }
  return <PanelTableActionButton label={isFa ? "حذف سطح" : "Delete level"} tone="danger" disabled={pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
