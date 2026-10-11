import { getPresentation } from "@/lib/site-content/presentation";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { getSiteContent } from "@/lib/site-content/queries";
export async function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const content = await getSiteContent();
  const presentation = getPresentation(content.presentation);
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
              <Image
                src="/images/reference-v4/cactus-mark.svg"
                width={30}
                height={42}
                alt=""
              />
              {locale === "fa" ? "کاکتوس" : "Cactus"}
            </Link>
            <p>
              {locale === "en" ? presentation.footerTaglineEn || presentation.footerTaglineFa : presentation.footerTaglineFa}
            </p>
          </div>
          {presentation.trustImageUrl && presentation.trustLink && <div className="footer-trust"><h2>{locale === "fa" ? "نماد اعتماد الکترونیکی" : "Electronic trust seal"}</h2><a href={presentation.trustLink} referrerPolicy="origin" target="_blank" rel="noopener noreferrer" aria-label={locale === "fa" ? "اعتبارسنجی نماد اعتماد" : "Verify trust seal"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={presentation.trustImageUrl} referrerPolicy="origin" alt={locale === "fa" ? "نماد اعتماد الکترونیکی" : "Electronic trust seal"} width={100} height={100} loading="lazy" />
          </a></div>}
          <div className="footer-links">
            <h2>{locale === "fa" ? "دسترسی سریع" : "Explore Cactus"}</h2>
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
          </div>
          <div className="footer-contact">
            <h2>{locale === "fa" ? "اطلاعات تماس" : "Contact us"}</h2>
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
                  dir={
                    locale === "en" && !content.addressEn ? "rtl" : undefined
                  }
                >
                  {address}
                </p>
              )}
            </address>
          </div>
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
