import Link from "next/link";
import { CartLink } from "@/components/workflows/cart";
import { CactusLogo } from "@/components/brand/cactus-brand";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
import { getCurrentUser } from "@/lib/auth/session";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { MobileNavigation } from "./mobile-navigation";
import { publicLinks } from "./navigation-links";
export async function SiteHeader({
  locale,
  currentPath = "/",
}: {
  locale: Locale;
  currentPath?: string;
}) {
  const user = await getCurrentUser();
  const alternateLocale = locale === "fa" ? "en" : "fa";
  const languageHref = `/api/preferences/locale?locale=${alternateLocale}&returnTo=${encodeURIComponent(localizePath(alternateLocale, currentPath))}`;
  return (
    <header className="public-header">
      <a href="#public-main" className="public-skip">
        {locale === "fa" ? "رفتن به محتوای اصلی" : "Skip to content"}
      </a>
      <div className="public-wrap">
        <div className="public-header-top">
          <Link
            href={localizePath(locale, "/")}
            className="public-brand"
            aria-label={locale === "fa" ? "کاکتوس — خانه" : "Cactus — Home"}
          >
            <CactusLogo />
            {locale === "fa" ? "کاکتوس" : "Cactus"}
          </Link>
          <span className="public-header-note">
            {locale === "fa"
              ? "مدرسه‌ای برای نسل سازنده"
              : "A school for the next generation of makers"}
          </span>
          <div className="public-header-tools">
            <Link
              className="public-button public-button--outline"
              href={user ? "/panel" : "/login"}
            >
              {locale === "fa"
                ? user
                  ? "پنل من"
                  : "ورود به پنل"
                : user
                  ? "My panel"
                  : "Sign in"}
            </Link>
            <CartLink locale={locale} />
            <PreferencesMenu locale={locale} alternateHref={languageHref} />
            <MobileNavigation
              locale={locale}
              currentPath={currentPath}
              signedIn={!!user}
            />
          </div>
        </div>
        <nav
          className="public-nav"
          aria-label={locale === "fa" ? "بخش‌های سایت" : "Site sections"}
        >
          {publicLinks.map(([path, fa, en]) => (
            <Link
              key={path}
              href={localizePath(locale, path)}
              aria-current={
                currentPath === path || currentPath.startsWith(path + "/")
                  ? "page"
                  : undefined
              }
            >
              {locale === "fa" ? fa : en}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
