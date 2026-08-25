"use client";

import { useTransition } from "react";
import { deleteTerm } from "@/app/(panel)/panel/admin/terms/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteTermButton({ termId, locale }: { termId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition(); const { confirm, toast } = useFeedback(); const isFa = locale === "fa";
  async function remove() { const approved = await confirm({ title: isFa ? "حذف ترم؟" : "Delete term?", description: isFa ? "برنامه، پیوندها و ثبت‌نام‌های این ترم حذف می‌شوند. اگر ترم پیش‌نیاز جای دیگری باشد، حذف متوقف می‌شود." : "Its schedule, links, and enrollments will be deleted. Deletion is blocked when another term requires it.", confirmLabel: isFa ? "حذف ترم" : "Delete term" }); if (!approved) return; startTransition(async () => { const result = await deleteTerm(termId, locale); if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success); }); }
  return <PanelTableActionButton label={isFa ? "حذف ترم" : "Delete term"} tone="danger" disabled={pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
