import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import type { getPublishedHonors } from "@/lib/honors/queries";

type HonorSummary = Awaited<ReturnType<typeof getPublishedHonors>>[number];
const localized = (en: string | null, fa: string, locale: Locale) => locale === "en" ? en || fa : fa;

export function HonorCard({ honor, locale }: { honor: HonorSummary; locale: Locale }) {
  const dictionary = getDictionary(locale);
  const title = localized(honor.titleEn, honor.titleFa, locale);
  const description = localized(honor.descriptionEn, honor.descriptionFa, locale);
  const organization = localized(honor.organizationEn, honor.organizationFa, locale);
  const categories = locale === "en" && honor.categoriesEn.length ? honor.categoriesEn : honor.categoriesFa;
  const date = new Intl.DateTimeFormat(localeConfig[locale].dateLocale, { dateStyle: "medium" }).format(new Date(`${honor.issuedAt}T00:00:00Z`));
  const fallbackRtl = locale === "en" && !honor.titleEn;
  return <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/8 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
    <Link href={localizePath(locale, `/honors/${honor.slug}`)} className="block aspect-[4/3] overflow-hidden bg-zinc-100 p-4 dark:bg-zinc-950">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={honor.certificateImageUrl} alt={title} className="size-full object-contain transition duration-500 group-hover:scale-[1.025]" />
    </Link>
    <div className="flex flex-1 flex-col p-6 text-start" dir={fallbackRtl ? "rtl" : undefined}>
      <div className="flex flex-wrap gap-2">{categories.slice(0, 3).map((category) => <span key={category} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{category}</span>)}</div>
      <h3 className="mt-4 text-xl font-bold leading-8 text-zinc-950 dark:text-zinc-50">{title}</h3>
      <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">{organization}</p>
      <p className="mt-3 line-clamp-3 leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm"><span className="text-zinc-500 dark:text-zinc-400">{date}</span><Link href={localizePath(locale, `/honors/${honor.slug}`)} className="font-semibold text-emerald-700 dark:text-emerald-400">{dictionary.viewHonor}</Link></div>
    </div>
  </article>;
}
