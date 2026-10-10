/* eslint-disable @next/next/no-img-element -- Managed media can use arbitrary validated remote hosts. */
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import type { getPublishedHonors } from "@/lib/honors/queries";
import { Arrow } from "@/components/public/design";
type HonorSummary = Awaited<ReturnType<typeof getPublishedHonors>>[number];
const localized = (en: string | null, fa: string, locale: Locale) =>
  locale === "en" ? en || fa : fa;
export function HonorCard({
  honor,
  locale,
  headingLevel = 3,
}: {
  honor: HonorSummary;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const d = getDictionary(locale);
  const title = localized(honor.titleEn, honor.titleFa, locale);
  const categories =
    locale === "en" && honor.categoriesEn.length
      ? honor.categoriesEn
      : honor.categoriesFa;
  const href = localizePath(locale, `/honors/${honor.slug}`);
  const date = new Intl.DateTimeFormat(localeConfig[locale].dateLocale, {
    dateStyle: "medium",
  }).format(new Date(`${honor.issuedAt}T00:00:00Z`));
  return (
    <article className="public-honor">
      <Link href={href} className="honor-visual">
        {}
        <img src={honor.certificateImageUrl} alt={title} loading="lazy" />
      </Link>
      <div dir={locale === "en" && !honor.titleEn ? "rtl" : undefined}>
        <div className="honor-tags">
          {categories.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <Heading>
          <Link href={href}>{title}</Link>
        </Heading>
        <p>
          {localized(honor.organizationEn, honor.organizationFa, locale)} ·{" "}
          {date}
        </p>
        <p>{localized(honor.descriptionEn, honor.descriptionFa, locale)}</p>
        <Link className="public-link mt-5" href={href}>
          {d.viewHonor}
          <Arrow />
        </Link>
      </div>
    </article>
  );
}
