"use client";

import { useTransition } from "react";
import { deleteManagedUser } from "@/app/(panel)/panel/admin/users/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

export function DeleteUserButton({ role, userId, disabled = false, locale }: { role: UserRole; userId: string; disabled?: boolean; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  const remove = async () => {
    const approved = await confirm({
      title: isFa ? "حذف حساب کاربری؟" : "Delete account?",
      description: isFa ? "این حساب برای همیشه حذف می‌شود. اگر به محتوایی متصل باشد، سامانه از حذف آن جلوگیری می‌کند." : "This account will be permanently deleted. The operation will be blocked if the account is connected to content.",
      confirmLabel: isFa ? "حذف حساب" : "Delete account",
    });
    if (!approved) return;

    startTransition(async () => {
      try {
        const result = await deleteManagedUser(role, userId, locale);
        if (result.error) toast.error(result.error);
        else if (result.success) toast.success(result.success);
      } catch {
        toast.error(isFa ? "حذف حساب انجام نشد." : "The account could not be deleted.");
      }
    });
  };

  const label = pending ? (isFa ? "در حال حذف…" : "Deleting…") : (isFa ? "حذف حساب" : "Delete account");
  return <PanelTableActionButton label={label} tone="danger" disabled={disabled || pending} onClick={remove}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}</PanelTableActionButton>;
}
