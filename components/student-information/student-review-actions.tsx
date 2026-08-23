"use client";

import { useState, useTransition } from "react";
import { approveStudentInformation, rejectStudentInformation } from "@/app/(panel)/panel/admin/students/[id]/information/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelTextarea } from "@/components/panel/form-controls";
import { primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function StudentReviewActions({ studentId, locale }: { studentId: string; locale: Locale }) {
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  async function approve() {
    const accepted = await confirm({
      title: isFa ? "تأیید اطلاعات دانش پژوه؟" : "Approve student information?",
      description: isFa ? "پس از تأیید، دانش پژوه به فضای آموزشی خود دسترسی خواهد داشت." : "Approval gives the student access to their learning workspace.",
      confirmLabel: isFa ? "تأیید پرونده" : "Approve submission",
      cancelLabel: isFa ? "انصراف" : "Cancel",
    });
    if (!accepted) return;
    startTransition(async () => {
      const result = await approveStudentInformation(studentId, locale);
      if (result.error) toast.error(result.error);
      if (result.success) toast.success(result.success);
    });
  }

  async function reject() {
    if (reason.trim().length < 3) {
      toast.error(isFa ? "ابتدا دلیل رد را وارد کنید." : "Enter a rejection reason first.");
      return;
    }
    const accepted = await confirm({
      title: isFa ? "بازگرداندن پرونده برای اصلاح؟" : "Return submission for changes?",
      description: isFa ? "دانش پژوه دلیل را می‌بیند و می‌تواند اطلاعات را اصلاح و دوباره ارسال کند." : "The student will see the reason and can edit and resubmit.",
      confirmLabel: isFa ? "رد و بازگرداندن" : "Reject and return",
      cancelLabel: isFa ? "انصراف" : "Cancel",
    });
    if (!accepted) return;
    startTransition(async () => {
      const result = await rejectStudentInformation(studentId, reason, locale);
      if (result.error) toast.error(result.error);
      if (result.success) {
        setReason("");
        toast.success(result.success);
      }
    });
  }

  return <div className="space-y-4">
    <label className="block text-start"><span className="mb-2 block text-sm font-medium">{isFa ? "دلیل رد (برای رد کردن الزامی)" : "Rejection reason (required to reject)"}</span><PanelTextarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} maxLength={1200} placeholder={isFa ? "دقیقاً توضیح دهید چه بخشی باید اصلاح شود…" : "Explain exactly what needs to be corrected…"} /></label>
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={pending} onClick={() => void approve()} className={primaryButtonClass}>{pending ? (isFa ? "در حال ثبت…" : "Saving…") : (isFa ? "تأیید اطلاعات" : "Approve information")}</button>
      <button type="button" disabled={pending} onClick={() => void reject()} className={`${secondaryButtonClass} border-red-200 text-red-700 hover:border-red-300 hover:text-red-800 dark:border-red-900 dark:text-red-400`}>{isFa ? "رد و درخواست اصلاح" : "Reject and request changes"}</button>
    </div>
  </div>;
}
