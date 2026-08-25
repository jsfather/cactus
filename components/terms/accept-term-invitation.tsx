"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { acceptTermInvitation } from "@/app/(panel)/panel/terms/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { primaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function AcceptTermInvitation({ token, locale }: { token: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useFeedback();
  const router = useRouter();
  const isFa = locale === "fa";
  function accept() {
    startTransition(async () => {
      const result = await acceptTermInvitation(token, locale);
      if (result.error) { toast.error(result.error); return; }
      router.push("/panel/student/schedule?toast=joined");
    });
  }
  return <button type="button" disabled={pending} onClick={accept} className={`${primaryButtonClass} w-full`}>{pending ? (isFa ? "در حال بررسی و ثبت‌نام…" : "Checking and enrolling…") : (isFa ? "پیوستن به این ترم" : "Join this term")}</button>;
}
