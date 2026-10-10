import Link from "next/link";
import { CactusLogo } from "@/components/brand/cactus-brand";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { getSiteContent } from "@/lib/site-content/queries";
export async function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const content = await getSiteContent();
  const year = new Intl.DateTimeFormat(localeConfig[locale].dateLocale, {
    year: "numeric",
  }).format(new Date());
  const address =
    locale === "en"
      ? content.addressEn || content.addressFa
      : content.addressFa;
  const copyright =
    locale === "en"
      ? content.footerTextEn || content.footerTextFa
      : content.footerTextFa;
  return (
    <footer className="public-footer">
      <div className="public-wrap">
        <div className="public-footer-top">
          <div>
            <Link href={localizePath(locale, "/")} className="public-brand">
              <CactusLogo />
              {locale === "fa" ? "کاکتوس" : "Cactus"}
            </Link>
            <p>
              {locale === "fa"
                ? "کنجکاو باش. تجربه کن. بساز."
                : "Stay curious. Experiment. Build."}
            </p>
          </div>
          <nav
            aria-label={
              locale === "fa" ? "پیوندهای پایین صفحه" : "Footer navigation"
            }
          >
            {[
              ["/courses", "دوره‌ها", "Courses"],
              ["/requirements", "پیش‌نیازها", "Preparation"],
              ["/teachers", dictionary.teachers, dictionary.teachers],
              ["/honors", dictionary.honors, dictionary.honors],
              ["/blog", dictionary.blog, dictionary.blog],
              ["/shop", dictionary.shop, dictionary.shop],
              ["/about", dictionary.about, dictionary.about],
              ["/search", "جست‌وجو", "Search"],
            ].map(([path, fa, en]) => (
              <Link key={path} href={localizePath(locale, path)}>
                {locale === "fa" ? fa : en}
              </Link>
            ))}
          </nav>
          <address>
            {content.contactNumber && (
              <a
                href={`tel:${content.contactNumber}`}
                dir="ltr"
                className="nums-en block"
              >
                {content.contactNumber}
              </a>
            )}
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                dir="ltr"
                className="nums-en block"
              >
                {content.email}
              </a>
            )}
            {address && (
              <p
                dir={locale === "en" && !content.addressEn ? "rtl" : undefined}
              >
                {address}
              </p>
            )}
          </address>
        </div>
        <div className="public-footer-bottom">
          <span>
            © {year} {copyright}
          </span>
          <span>
            {locale === "fa"
              ? "یادگیری، ساختن، آینده"
              : "Learn. Build. Shape the future."}
          </span>
        </div>
      </div>
    </footer>
  );
}
