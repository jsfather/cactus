export const locales = ["fa", "en"] as const;

export type Locale = (typeof locales)[number];

export const localeConfig = {
  fa: { lang: "fa", dir: "rtl" as const, dateLocale: "fa-IR" },
  en: { lang: "en", dir: "ltr" as const, dateLocale: "en-US" },
};

export function localizePath(locale: Locale, path: string) {
  if (locale === "fa") {
    return path || "/";
  }

  return path === "/" ? "/en" : `/en${path}`;
}
