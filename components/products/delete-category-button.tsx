"use client";

import { useTransition } from "react";
import { deleteCategory } from "@/app/(panel)/panel/admin/product-categories/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteCategoryButton({ categoryId, locale }: { categoryId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";
  async function remove() {
    const approved = await confirm({ title: isFa ? "حذف دسته؟" : "Delete category?", description: isFa ? "محصولات حذف نمی‌شوند؛ فقط اتصال آن‌ها به این دسته برداشته می‌شود." : "Products will remain; only their assignment to this category is removed.", confirmLabel: isFa ? "حذف دسته" : "Delete category" });
    if (!approved) return;
    startTransition(async () => { const result = await deleteCategory(categoryId, locale); if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success); });
  }
  return <PanelTableActionButton label={isFa ? "حذف دسته" : "Delete category"} tone="danger" disabled={pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
