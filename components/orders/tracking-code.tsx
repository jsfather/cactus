"use client";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
export function TrackingCode({
  code,
  locale,
}: {
  code: string;
  locale: Locale;
}) {
  const { toast } = useFeedback(),
    fa = locale === "fa";
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
      <p className="text-sm font-semibold">
        {fa ? "کد رهگیری مرسوله پستی" : "Postal tracking number"}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p
          dir="ltr"
          className="nums-en break-all text-xl font-bold tracking-wider"
        >
          {code}
        </p>
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              toast.success(
                fa ? "کد رهگیری کپی شد." : "Tracking number copied.",
              );
            } catch {
              toast.error(
                fa
                  ? "کپی انجام نشد؛ کد را دستی انتخاب کنید."
                  : "Could not copy. Select the number manually.",
              );
            }
          }}
        >
          {fa ? "کپی کد رهگیری" : "Copy tracking number"}
        </button>
      </div>
    </section>
  );
}
