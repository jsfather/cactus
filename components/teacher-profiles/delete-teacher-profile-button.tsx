"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAdminTeacherProfile } from "@/app/(panel)/panel/teacher-profile-actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelActionSpinner, PanelDeleteIcon, getPanelButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteTeacherProfileButton({ teacherId, locale }: { teacherId: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const router = useRouter();
  const isFa = locale === "fa";

  async function remove() {
    const approved = await confirm({
      title: isFa ? "حذف پروفایل حرفه‌ای؟" : "Delete professional profile?",
      description: isFa ? "سوابق، مهارت‌ها و صفحه عمومی این مدرس حذف می‌شود؛ حساب کاربری مدرس باقی می‌ماند." : "The professional history, skills, and public page will be removed. The teacher account will remain.",
      confirmLabel: isFa ? "حذف پروفایل" : "Delete profile",
    });
    if (!approved) return;
    startTransition(async () => {
      try {
        const result = await deleteAdminTeacherProfile(teacherId, locale);
        if (result.error) toast.error(result.error);
        else {
          if (result.success) toast.success(result.success);
          router.replace("/panel/admin/teachers");
          router.refresh();
        }
      } catch {
        toast.error(isFa ? "حذف پروفایل انجام نشد." : "The profile could not be deleted.");
      }
    });
  }

  return <button type="button" disabled={pending} onClick={remove} className={`${getPanelButtonClass("secondary")} text-red-600 dark:text-red-400`}>{pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}{isFa ? "حذف پروفایل" : "Delete profile"}</button>;
}
