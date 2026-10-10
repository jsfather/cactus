import Image from "next/image";
import Link from "next/link";
import { CartLink } from "@/components/workflows/cart";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
import { getCurrentUser } from "@/lib/auth/session";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { MobileNavigation } from "./mobile-navigation";
import { publicLinks } from "./navigation-links";
import { PublicIcon } from "./icons";
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
    <>
      <header
        className={`public-header ${currentPath === "/" ? "public-header--home" : ""}`}
      >
        <a href="#public-main" className="public-skip">
          {locale === "fa" ? "رفتن به محتوای اصلی" : "Skip to content"}
        </a>
        <div className="public-header-shell" dir={locale === "fa" ? "rtl" : "ltr"}>
          <Link
            href={localizePath(locale, "/")}
            className="public-brand"
            aria-label={locale === "fa" ? "کاکتوس — خانه" : "Cactus — Home"}
          >
            <Image
              src="/images/reference-v4/cactus-mark.svg"
              width={30}
              height={42}
              alt=""
            />
            <span>
              {locale === "fa" ? "کاکتوس" : "Cactus"}
              <small className="nums-en" lang="en">
                ROBOTICS
              </small>
            </span>
          </Link>
          <nav
            className="public-nav"
            dir={locale === "fa" ? "rtl" : "ltr"}
            aria-label={locale === "fa" ? "بخش‌های سایت" : "Site sections"}
          >
            {publicLinks
              .filter(([path]) => path !== "/search")
              .map(([path, fa, en]) => (
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
          <form
            action={localizePath(locale, "/search")}
            className="header-search"
            role="search"
            dir={locale === "fa" ? "rtl" : "ltr"}
          >
            <input
              name="q"
              maxLength={100}
              aria-label={locale === "fa" ? "جست‌وجوی سایت" : "Search the site"}
              placeholder={
                locale === "fa"
                  ? "جست‌وجوی محصولات، دوره‌ها…"
                  : "Search products, courses…"
              }
            />
            <button aria-label={locale === "fa" ? "جست‌وجو" : "Search"}>
              <PublicIcon name="search" />
            </button>
          </form>
          <div
            className="public-header-tools"
            dir={locale === "fa" ? "rtl" : "ltr"}
          >
            <PreferencesMenu locale={locale} alternateHref={languageHref} variant="public" />
            <CartLink locale={locale} />
            <Link
              className="public-button header-login"
              href={user ? "/panel" : "/login"}
            >
              {locale === "fa"
                ? user
                  ? "پنل من"
                  : "ورود / ثبت‌نام"
                : user
                  ? "My panel"
                  : "Sign in"}
            </Link>
            <Link
              className="header-mobile-search"
              href={localizePath(locale, "/search")}
              aria-label={locale === "fa" ? "جست‌وجو" : "Search"}
            >
              <PublicIcon name="search" />
            </Link>
            <MobileNavigation
              locale={locale}
              currentPath={currentPath}
              signedIn={!!user}
            />
          </div>
        </div>
      </header>
      <nav
        className="public-bottom-nav"
        aria-label={
          locale === "fa" ? "دسترسی سریع موبایل" : "Mobile quick navigation"
        }
      >
        {(
          [
            ["/", "خانه", "Home", "home"],
            ["/shop", "فروشگاه", "Shop", "shop"],
            ["/courses", "دوره‌ها", "Courses", "courses"],
            ["/blog", "وبلاگ", "Blog", "book"],
            ["/search", "جست‌وجو", "Search", "search"],
          ] as const
        ).map(([path, fa, en, icon]) => (
          <Link
            key={path}
            href={localizePath(locale, path)}
            aria-current={
              currentPath === path ||
              (path !== "/" && currentPath.startsWith(path + "/"))
                ? "page"
                : undefined
            }
          >
            <PublicIcon name={icon} />
            <span>{locale === "fa" ? fa : en}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
