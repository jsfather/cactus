import Link from "next/link";
import { ThemeSelect } from "@/components/theme/theme-select";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";

export function SiteHeader({
  locale,
  currentPath = "/",
}: {
  locale: Locale;
  currentPath?: string;
}) {
  const dictionary = getDictionary(locale);
  const alternateLocale = locale === "fa" ? "en" : "fa";

  return (
    <header className="border-b border-emerald-950/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link href={localizePath(locale, "/")} className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-emerald-700 text-xl font-black text-white shadow-lg shadow-emerald-700/20 dark:bg-emerald-500 dark:text-emerald-950">
            ک
          </span>
          <span className="hidden font-bold text-zinc-950 sm:inline dark:text-zinc-50">
            {dictionary.school}
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-5">
          <Link
            href={localizePath(locale, "/")}
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-emerald-700 sm:block dark:text-zinc-300 dark:hover:text-emerald-400"
          >
            {dictionary.home}
          </Link>
          <Link
            href={localizePath(locale, "/blog")}
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-emerald-700 sm:block dark:text-zinc-300 dark:hover:text-emerald-400"
          >
            {dictionary.blog}
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-emerald-700/20 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:px-4 dark:border-emerald-400/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950"
          >
            {dictionary.panel}
          </Link>
          <ThemeSelect locale={locale} />
          <Link
            href={localizePath(alternateLocale, currentPath)}
            hrefLang={alternateLocale}
            className="nums-en text-sm font-medium text-zinc-500 transition hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            {dictionary.language}
          </Link>
        </nav>
      </div>
    </header>
  );
}
