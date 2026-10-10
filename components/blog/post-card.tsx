/* eslint-disable @next/next/no-img-element -- Managed media can use arbitrary validated remote hosts. */
import Link from "next/link";
import type { getPublishedPosts } from "@/lib/blog/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { Arrow } from "@/components/public/design";
type PostSummary = Awaited<ReturnType<typeof getPublishedPosts>>[number];
export function PostCard({
  post,
  locale,
}: {
  post: PostSummary;
  locale: Locale;
}) {
  const d = getDictionary(locale);
  const title = locale === "en" ? post.titleEn || post.titleFa : post.titleFa;
  const excerpt =
    locale === "en" ? post.excerptEn || post.excerptFa : post.excerptFa;
  const href = localizePath(locale, `/blog/${post.slug}`);
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(localeConfig[locale].dateLocale, {
        dateStyle: "medium",
      }).format(post.publishedAt)
    : null;
  return (
    <article className="public-post">
      <Link href={href} className="post-visual" aria-label={title}>
        {post.coverImageUrl ? (
           <img
            src={post.coverImageUrl}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className="post-placeholder nums-en" aria-hidden="true">
            &#123; / &#125;
          </span>
        )}
      </Link>
      <div>
        <span className="public-kicker">
          {locale === "fa" ? "دفتر کاکتوس" : "CACTUS JOURNAL"}
        </span>
        <h3
          className="mt-3"
          dir={locale === "en" && !post.titleEn ? "rtl" : undefined}
        >
          <Link href={href}>{title}</Link>
        </h3>
        <p
          className="line-clamp-3"
          dir={locale === "en" && !post.excerptEn ? "rtl" : undefined}
        >
          {excerpt}
        </p>
        <div className="post-meta">
          <span>{date}</span>
          <Link href={href}>
            {d.readMore} <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}
