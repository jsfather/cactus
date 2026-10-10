"use client";
import Link from "next/link";
import { CactusLogo } from "@/components/brand/cactus-brand";
import { localizePath, type Locale } from "@/lib/i18n/config";
export function PublicError({
  locale,
  retry,
}: {
  locale: Locale;
  retry: () => void;
}) {
  return (
    <main className="public-site public-status">
      <CactusLogo />
      <p className="public-kicker">{locale === "fa" ? "کاکتوس" : "Cactus"}</p>
      <h1>
        {locale === "fa"
          ? "این صفحه موقتاً در دسترس نیست"
          : "This page is temporarily unavailable"}
      </h1>
      <p className="public-description">
        {locale === "fa"
          ? "دوباره امتحان کنید یا به صفحه اصلی برگردید."
          : "Try again or return to the homepage."}
      </p>
      <div className="home-actions">
        <button className="public-button" onClick={retry}>
          {locale === "fa" ? "تلاش دوباره" : "Try again"}
        </button>
        <Link
          className="public-button public-button--outline"
          href={localizePath(locale, "/")}
        >
          {locale === "fa" ? "صفحه اصلی" : "Homepage"}
        </Link>
      </div>
    </main>
  );
}
export function PublicLoading({ locale }: { locale: Locale }) {
  return (
    <main className="public-site public-status" aria-busy="true">
      <CactusLogo />
      <p role="status">{locale === "fa" ? "در حال بارگذاری…" : "Loading…"}</p>
      <span className="public-loading-line" aria-hidden="true" />
    </main>
  );
}
