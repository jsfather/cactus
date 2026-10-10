"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { publicLinks } from "./navigation-links";
export function MobileNavigation({
  locale,
  currentPath,
  signedIn,
}: {
  locale: Locale;
  currentPath: string;
  signedIn: boolean;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function close(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        ref.current.open = false;
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <details ref={ref} className="public-mobile-menu">
      <summary
        aria-label={locale === "fa" ? "فهرست بخش‌های سایت" : "Site navigation"}
      >
        {locale === "fa" ? "منو" : "Menu"} <span aria-hidden="true">☰</span>
      </summary>
      <nav
        className="mobile-nav"
        aria-label={locale === "fa" ? "فهرست موبایل" : "Mobile navigation"}
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
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
          >
            {locale === "fa" ? fa : en}
          </Link>
        ))}
        <Link href={signedIn ? "/panel" : "/login"}>
          {locale === "fa"
            ? signedIn
              ? "پنل من"
              : "ورود به پنل"
            : signedIn
              ? "My panel"
              : "Sign in"}
        </Link>
      </nav>
    </details>
  );
}
