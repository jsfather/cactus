import Link from "next/link";
import { CactusLogo } from "@/components/brand/cactus-brand";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { getSiteContent } from "@/lib/site-content/queries";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [dictionary, content] = await Promise.all([Promise.resolve(getDictionary(locale)), getSiteContent()]);
  const year = new Intl.DateTimeFormat(localeConfig[locale].dateLocale, { year: "numeric" }).format(new Date());
  const address = locale === "en" ? content.addressEn || content.addressFa : content.addressFa;
  const copyright = locale === "en" ? content.footerTextEn || content.footerTextFa : content.footerTextFa;
  return <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-10">
      <div><div className="flex items-center gap-3"><CactusLogo className="size-9 shrink-0" /><strong className="text-zinc-900 dark:text-zinc-100">{dictionary.school}</strong></div></div>
      <nav className="flex flex-col items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300"><Link href={localizePath(locale, "/")}>{dictionary.home}</Link><Link href={localizePath(locale, "/about")}>{dictionary.about}</Link><Link href={localizePath(locale, "/teachers")}>{dictionary.teachers}</Link><Link href={localizePath(locale, "/honors")}>{dictionary.honors}</Link><Link href={localizePath(locale, "/blog")}>{dictionary.blog}</Link><Link href={localizePath(locale, "/shop")}>{dictionary.shop}</Link></nav>
      <address className="space-y-2 text-sm not-italic text-zinc-500 dark:text-zinc-400">{content.contactNumber ? <a href={`tel:${content.contactNumber}`} dir="ltr" className="nums-en block text-start">{content.contactNumber}</a> : null}{content.email ? <a href={`mailto:${content.email}`} dir="ltr" className="nums-en block text-start">{content.email}</a> : null}{address ? <p className="leading-6">{address}</p> : null}</address>
    </div>
    <div className="border-t border-zinc-200 px-5 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">© <span>{year}</span> {copyright}</div>
  </footer>;
}
