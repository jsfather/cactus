import Link from "next/link";
import { CactusBrand } from "@/components/brand/cactus-brand";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
import { getCurrentUser } from "@/lib/auth/session";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";

export async function SiteHeader({
  locale,
  currentPath = "/",
}: {
  locale: Locale;
  currentPath?: string;
}) {
  const user = await getCurrentUser();
  const dictionary = getDictionary(locale);
  const alternateLocale = locale === "fa" ? "en" : "fa";
  const alternatePath = localizePath(alternateLocale, currentPath);
  const languageHref = `/api/preferences/locale?locale=${alternateLocale}&returnTo=${encodeURIComponent(alternatePath)}`;

  return (
    <header className="relative z-50 border-b border-emerald-950/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link href={localizePath(locale, "/")} aria-label={dictionary.school}>
          <span className="sm:hidden"><CactusBrand locale={locale} compact /></span>
          <span className="hidden sm:inline"><CactusBrand locale={locale} /></span>
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
            href={localizePath(locale, "/teachers")}
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-emerald-700 md:block dark:text-zinc-300 dark:hover:text-emerald-400"
          >
            {dictionary.teachers}
          </Link>
          <Link
            href={localizePath(locale, "/honors")}
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-emerald-700 lg:block dark:text-zinc-300 dark:hover:text-emerald-400"
          >
            {dictionary.honors}
          </Link>
          <Link
            href={localizePath(locale, "/shop")}
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-emerald-700 xl:block dark:text-zinc-300 dark:hover:text-emerald-400"
          >
            {dictionary.shop}
          </Link>
          <Link
            href={localizePath(locale, "/about")}
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-emerald-700 2xl:block dark:text-zinc-300 dark:hover:text-emerald-400"
          >
            {dictionary.about}
          </Link>
          <Link
            href={user ? "/panel" : "/login"}
            className="rounded-xl border border-emerald-700/20 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:px-4 dark:border-emerald-400/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950"
          >
            {user ? dictionary.myPanel : dictionary.panel}
          </Link>
          <PreferencesMenu
            locale={locale}
            alternateHref={languageHref}
          />
        </nav>
      </div>
    </header>
  );
}
