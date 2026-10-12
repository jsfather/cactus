import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublishedLanding } from "@/lib/landings/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { getContentComments } from "@/lib/comments/queries";
import { CommentsSection } from "@/components/comments/comments-section";
import { RichContent } from "@/components/content/rich-content";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/site";
export async function landingMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  await connection();
  const page = await getPublishedLanding(slug);
  if (!page)
    return {
      title: locale === "fa" ? "صفحه پیدا نشد" : "Page not found",
      robots: { index: false },
    };
  const title = locale === "en" ? page.titleEn || page.titleFa : page.titleFa,
    description =
      locale === "en" ? page.summaryEn || page.summaryFa : page.summaryFa;
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(localizePath(locale, `/${slug}`)),
      languages: {
        fa: absoluteUrl(`/${slug}`),
        en: absoluteUrl(`/en/${slug}`),
      },
    },
    openGraph: {
      title,
      description,
      images: page.coverImageUrl
        ? [absoluteUrl(page.coverImageUrl)]
        : undefined,
    },
  };
}
export async function LandingPage({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  await connection();
  const page = await getPublishedLanding(slug);
  if (!page) notFound();
  const user = await getCurrentUser(),
    comments = page.commentsEnabled
      ? await getContentComments({ landingId: page.id }, user?.id)
      : [];
  const title = locale === "en" ? page.titleEn || page.titleFa : page.titleFa;
  const localized = (fa: string, en: string) =>
    locale === "en" ? en || fa : fa;
  const cta = page.cta;
  return (
    <div className="public-site public-detail">
      <SiteHeader locale={locale} currentPath={`/${slug}`} />
      <main id="public-main" className="public-wrap landing-main">
        <article>
          <header className="landing-heading">
            <p className="public-kicker">
              {locale === "fa"
                ? "کاکتوس؛ یادگیری برای آینده"
                : "Cactus; learning for the future"}
            </p>
            <h1 dir={locale === "en" && !page.titleEn ? "rtl" : undefined}>
              {title}
            </h1>
            <p
              className="public-description"
              dir={locale === "en" && !page.summaryEn ? "rtl" : undefined}
            >
              {localized(page.summaryFa, page.summaryEn)}
            </p>
          </header>
          {page.coverImageUrl && (
            <div className="landing-cover">
              <Image
                src={page.coverImageUrl}
                alt={title}
                width={1280}
                height={720}
                unoptimized
                priority
              />
            </div>
          )}
          {page.videoUrl && (
            <figure className="landing-video">
              <video
                controls
                playsInline
                preload="metadata"
                src={page.videoUrl}
                poster={page.coverImageUrl || undefined}
                aria-label={title}
              />
            </figure>
          )}
          <div className="landing-content">
            <RichContent
              html={localized(page.contentFa, page.contentEn)}
              dir={locale === "en" && !page.contentEn ? "rtl" : undefined}
            />
            {cta.href && (
              <aside className="landing-cta">
                <div>
                  <h2>{localized(cta.titleFa, cta.titleEn)}</h2>
                  <p>{localized(cta.textFa, cta.textEn)}</p>
                </div>
                <Link
                  className="public-button"
                  href={
                    cta.href.startsWith("/") && !/^\/en(?:\/|$)/.test(cta.href)
                      ? localizePath(locale, cta.href)
                      : cta.href
                  }
                >
                  {localized(cta.labelFa, cta.labelEn)}
                  <span aria-hidden="true">↗</span>
                </Link>
              </aside>
            )}
            <RichContent
              html={localized(page.afterCtaFa, page.afterCtaEn)}
              dir={locale === "en" && !page.afterCtaEn ? "rtl" : undefined}
            />
            {page.commentsEnabled && (
              <CommentsSection
                locale={locale}
                targetType="landing"
                targetId={page.id}
                slug={slug}
                comments={comments}
                user={user}
              />
            )}
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
