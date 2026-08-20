"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/(panel)/panel/admin/products/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteProductButton({ productId, locale }: { productId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  const remove = async () => {
    const approved = await confirm({
      title: isFa ? "حذف محصول؟" : "Delete product?",
      description: isFa ? "این محصول برای همیشه از فروشگاه حذف می‌شود و این عملیات قابل بازگشت نیست." : "This product will be permanently removed from the shop. This action cannot be undone.",
      confirmLabel: isFa ? "حذف محصول" : "Delete product",
    });
    if (!approved) return;

    startTransition(async () => {
      try {
        const result = await deleteProduct(productId, locale);
        if (result.error) toast.error(result.error);
        else if (result.success) toast.success(result.success);
      } catch {
        toast.error(isFa ? "حذف محصول انجام نشد." : "The product could not be deleted.");
      }
    });
  };

  const label = pending ? (isFa ? "در حال حذف…" : "Deleting…") : (isFa ? "حذف محصول" : "Delete product");
  return <PanelTableActionButton label={label} tone="danger" disabled={pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
