import { getPresentation } from "@/lib/site-content/presentation";
import Link from "next/link";
import Image from "next/image";
import { getSiteNavigation } from "@/lib/site-content/navigation-server";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { getSiteContent } from "@/lib/site-content/queries";
export async function SiteFooter({ locale }: { locale: Locale }) {
  const [content, settings] = await Promise.all([getSiteContent(), getSiteNavigation()]);
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
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logoUrl} width={30} height={42} alt="" className="site-managed-logo" />
              ) : <Image
                src="/images/reference-v4/cactus-mark.svg"
                width={30}
                height={42}
                alt=""
              />}
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
              {settings.footerLinks.map(({ href: path, labelFa: fa, labelEn: en }) => (
                <Link key={path} href={path.startsWith("/") ? localizePath(locale, path) : path}>
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
            {settings.socialLinks.length > 0 && <nav className="mt-5 flex flex-wrap gap-2" aria-label={locale === "fa" ? "شبکه‌های اجتماعی" : "Social networks"}>
              {settings.socialLinks.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center rounded-full border border-current/20 px-3 py-2 text-sm transition hover:bg-emerald-500/10">{locale === "fa" ? link.labelFa : link.labelEn}<span aria-hidden="true" className="ms-2">↗</span></a>)}
            </nav>}
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
