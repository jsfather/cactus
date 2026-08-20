"use client";

import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelCopyIcon, PanelTableActionButton } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function CopyMediaUrlButton({ url, locale }: { url: string; locale: Locale }) {
  const { toast } = useFeedback();
  const isFa = locale === "fa";

  return (
    <PanelTableActionButton
      label={isFa ? "کپی نشانی تصویر" : "Copy image URL"}
      tone="copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
          toast.success(isFa ? "نشانی تصویر کپی شد." : "Image URL copied.");
        } catch {
          toast.error(isFa ? "کپی نشانی انجام نشد." : "The URL could not be copied.");
        }
      }}
    >
      <PanelCopyIcon />
    </PanelTableActionButton>
  );
}
