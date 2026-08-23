/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getPublishedHonor } from "@/lib/honors/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/site";

const localized = (en: string | null, fa: string, locale: Locale) => locale === "en" ? en || fa : fa;

export async function HonorPage({ locale, slug }: { locale: Locale; slug: string }) {
  await connection();
  const honor = await getPublishedHonor(slug);
  if (!honor) notFound();
  const dictionary = getDictionary(locale);
  const title = localized(honor.titleEn, honor.titleFa, locale);
  const description = localized(honor.descriptionEn, honor.descriptionFa, locale);
  const organization = localized(honor.organizationEn, honor.organizationFa, locale);
  const location = localized(honor.locationEn, honor.locationFa, locale);
  const categories = locale === "en" && honor.categoriesEn.length ? honor.categoriesEn : honor.categoriesFa;
  const date = new Intl.DateTimeFormat(localeConfig[locale].dateLocale, { dateStyle: "long" }).format(new Date(`${honor.issuedAt}T00:00:00Z`));
  const fallbackRtl = locale === "en" && !honor.titleEn;
  const pathname = `${locale === "en" ? "/en" : ""}/honors/${honor.slug}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: title, description, image: honor.certificateImageUrl, dateCreated: honor.issuedAt, creator: { "@type": "Organization", name: organization }, url: absoluteUrl(pathname) };
  return <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><SiteHeader locale={locale} currentPath={`/honors/${honor.slug}`} /><main><article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><header className="border-b border-emerald-950/10 bg-emerald-50 dark:border-white/10 dark:bg-emerald-950/25"><div className="mx-auto w-full max-w-5xl px-5 py-14 text-start sm:px-8 sm:py-20"><Link href={localizePath(locale, "/honors")} className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{dictionary.backToHonors}</Link><div className="mt-6 flex flex-wrap gap-2">{categories.map((category) => <span key={category} className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{category}</span>)}</div><h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-5xl" dir={fallbackRtl ? "rtl" : undefined}>{title}</h1><p className="mt-5 text-lg font-semibold text-emerald-700 dark:text-emerald-400" dir={fallbackRtl ? "rtl" : undefined}>{organization}</p></div></header><div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-10"><div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 p-4 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900"><div className="aspect-[4/3]"><img src={honor.certificateImageUrl} alt={title} className="size-full object-contain" /></div></div><aside className="space-y-6 lg:sticky lg:top-6"><section className="rounded-3xl border border-zinc-200 bg-white p-6 text-start dark:border-zinc-800 dark:bg-zinc-950" dir={fallbackRtl ? "rtl" : undefined}><h2 className="text-xl font-bold">{locale === "fa" ? "درباره این دستاورد" : "About this achievement"}</h2><p className="mt-4 whitespace-pre-line leading-8 text-zinc-600 dark:text-zinc-300">{description}</p></section><dl className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-start dark:border-zinc-800 dark:bg-zinc-900/60"><Detail label={dictionary.issuedBy} value={organization} /><Detail label={dictionary.issuedOn} value={date} /><Detail label={dictionary.honorLocation} value={location} last /></dl></aside></div></article></main><SiteFooter locale={locale} /></div>;
}

function Detail({ label, value, last = false }: { label: string; value: string; last?: boolean }) { return <div className={last ? "" : "mb-5 border-b border-zinc-200 pb-5 dark:border-zinc-800"}><dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</dt><dd className="mt-1.5 font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd></div>; }
