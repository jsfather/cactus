import Link from "next/link";
import { CactusLogo } from "@/components/brand/cactus-brand";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const year = new Intl.DateTimeFormat(localeConfig[locale].dateLocale, {
    year: "numeric",
  }).format(new Date());

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <CactusLogo className="size-8 shrink-0" />
          <p>© <span>{year}</span> {dictionary.school}</p>
        </div>
        <div className="flex gap-5">
          <Link href={localizePath(locale, "/")}>{dictionary.home}</Link>
          <Link href={localizePath(locale, "/blog")}>{dictionary.blog}</Link>
          <Link href={localizePath(locale, "/shop")}>{dictionary.shop}</Link>
        </div>
      </div>
    </footer>
  );
}
