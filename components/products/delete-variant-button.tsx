"use client";

import { useTransition } from "react";
import { deleteVariant } from "@/app/(panel)/panel/admin/products/[id]/variants/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteVariantButton({ productId, variantId, locale }: { productId: string; variantId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition(); const { confirm, toast } = useFeedback(); const isFa = locale === "fa";
  async function remove() { const approved = await confirm({ title: isFa ? "حذف تنوع؟" : "Delete variant?", description: isFa ? "این تنوع و موجودی آن برای همیشه حذف می‌شود." : "This variant and its inventory will be permanently deleted.", confirmLabel: isFa ? "حذف تنوع" : "Delete variant" }); if (!approved) return; startTransition(async () => { const result = await deleteVariant(productId, variantId, locale); if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success); }); }
  return <PanelTableActionButton label={isFa ? "حذف تنوع" : "Delete variant"} tone="danger" disabled={pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
