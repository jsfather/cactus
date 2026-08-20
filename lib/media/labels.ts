import type { MediaKind } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

const labels: Record<Locale, Record<MediaKind, string>> = {
  fa: {
    avatar: "تصویر پروفایل",
    post: "نوشته وبلاگ",
    product: "محصول",
    content: "محتوای غنی",
  },
  en: {
    avatar: "Avatar",
    post: "Blog post",
    product: "Product",
    content: "Rich content",
  },
};

export function getMediaKindLabel(kind: MediaKind, locale: Locale) {
  return labels[locale][kind];
}
