import type { Locale } from "@/lib/i18n/config";

export type LocalizedUserName = {
  firstNameFa: string;
  lastNameFa: string;
  firstNameEn: string;
  lastNameEn: string;
};

export function getLocalizedUserName(
  user: LocalizedUserName,
  locale: Locale,
) {
  return locale === "fa"
    ? `${user.firstNameFa} ${user.lastNameFa}`.trim()
    : `${user.firstNameEn} ${user.lastNameEn}`.trim();
}
