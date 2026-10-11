import { formatMarketingText } from "@/lib/content/marketing";
import { RichContent } from "@/components/content/rich-content";
/* eslint-disable @next/next/no-img-element -- Course covers can use arbitrary validated media hosts. */
import Link from "next/link";
import { coursePages } from "@/lib/db/schema";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { Arrow } from "./design";
export function CourseCard({
  course: c,
  price,
  locale,
  headingLevel = 3,
}: {
  course: typeof coursePages.$inferSelect;
  price: number | null;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const title = locale === "en" ? c.titleEn || c.titleFa : c.titleFa;
  const summary = locale === "en" ? c.summaryEn || c.summaryFa : c.summaryFa;
  const level = (
    {
      beginner: ["مقدماتی", "Beginner"],
      intermediate: ["متوسط", "Intermediate"],
      advanced: ["پیشرفته", "Advanced"],
    } as Record<string, string[]>
  )[c.level];
  return (
    <article className="public-course">
      <Link
        className="course-visual"
        href={localizePath(locale, `/courses/${c.slug}`)}
        aria-label={title}
      >
        <img src={c.coverImageUrl || "/images/reference-v4/scene-arduino.svg"} alt="" loading="lazy" />
        {c.level && (
          <span className="course-level">{level?.[locale === "fa" ? 0 : 1] || c.level}</span>
        )}
      </Link>
      <div className="course-copy">
        <p className="course-meta">
          {c.topic} · {c.ageGroup}
        </p>
        <Heading dir={locale === "en" && !c.titleEn ? "rtl" : undefined}>
          <Link href={localizePath(locale, `/courses/${c.slug}`)}>{title}</Link>
        </Heading>
        <RichContent
          html={formatMarketingText(summary)}
          className="line-clamp-2"
          dir={locale === "en" && !c.summaryEn ? "rtl" : undefined}
        />
        <div className="course-bottom">
          <strong>
            {price === null
              ? locale === "fa"
                ? "اطلاعات دوره"
                : "Course information"
              : price === 0
                ? locale === "fa"
                  ? "رایگان"
                  : "Free"
                : `${new Intl.NumberFormat(localeConfig[locale].dateLocale).format(price)} ${locale === "fa" ? "تومان" : "toman"}`}
          </strong>
          <Link
            href={localizePath(locale, `/courses/${c.slug}`)}
            aria-label={locale === "fa" ? `جزئیات ${title}` : `View ${title}`}
          >
            <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}
