import type { Locale } from "@/lib/i18n/config";

export type LocalizedUserName = {
  nameFa: string;
  nameEn: string;
};

export function getLocalizedUserName(
  user: LocalizedUserName,
  locale: Locale,
) {
  return locale === "fa" ? user.nameFa : user.nameEn;
}
