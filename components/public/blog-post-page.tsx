import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { RichContent } from "@/components/content/rich-content";
import { CommentsSection } from "@/components/comments/comments-section";
import { getCurrentUser } from "@/lib/auth/session";
import { getPublishedPost } from "@/lib/blog/queries";
import { getContentComments } from "@/lib/comments/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/site";

export async function BlogPostPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  await connection();
  const post = await getPublishedPost(slug, locale);

  if (!post) {
    notFound();
  }

  const user = await getCurrentUser();
  const comments = await getContentComments({ postId: post.id }, user?.id);

  const dictionary = getDictionary(locale);
  const title = locale === "en" ? post.titleEn || post.titleFa : post.titleFa;
  const excerpt =
    locale === "en" ? post.excerptEn || post.excerptFa : post.excerptFa;
  const content =
    locale === "en" ? post.contentEn || post.contentFa : post.contentFa;
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(localeConfig[locale].dateLocale, {
        dateStyle: "long",
      }).format(post.publishedAt)
    : null;
  const pathname = `${locale === "en" ? "/en" : ""}/blog/${post.slug}`;
  const seoDescription = locale === "en"
    ? post.seoDescriptionEn || post.excerptEn || post.seoDescriptionFa || post.excerptFa
    : post.seoDescriptionFa || post.excerptFa;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: seoDescription,
    image: post.seoImageUrl || post.coverImageUrl || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: locale === "fa" ? "کاکتوس" : "Cactus", url: absoluteUrl(locale === "en" ? "/en" : "/") },
    keywords: post.tags.join(", "),
    inLanguage: locale === "fa" ? "fa-IR" : "en-US",
    mainEntityOfPage: post.canonicalUrl || absoluteUrl(pathname),
  };

  return (
    <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} currentPath={`/blog/${post.slug}`} />
      <main>
        <article>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <header className="border-b border-emerald-950/10 bg-emerald-50 dark:border-white/10 dark:bg-emerald-950/25">
            <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
              <Link
                href={localizePath(locale, "/blog")}
                className="text-sm font-semibold text-emerald-700 dark:text-emerald-400"
              >
                {dictionary.backToBlog}
              </Link>
              <h1 className="mt-6 text-4xl font-black leading-tight text-balance sm:text-5xl sm:leading-tight">
                {title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {excerpt}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{post.authorName}</span>
                <span>
                  {dictionary.publishedOn}: {date}
                </span>
              </div>
              {post.tags.length ? (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={locale === "fa" ? "برچسب‌ها" : "Tags"}>
                  {post.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{tag}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </header>

          {post.coverImageUrl ? (
            <div className="mx-auto -mt-1 w-full max-w-5xl px-5 pt-10 sm:px-8">
              <div className="aspect-[16/7] overflow-hidden rounded-[2rem] bg-zinc-100 shadow-2xl shadow-emerald-950/10 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImageUrl} alt="" className="size-full object-cover" />
              </div>
            </div>
          ) : null}

          <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
            <RichContent html={content} className="text-lg leading-9 text-zinc-700 dark:text-zinc-300" />
          </div>
        </article>
        <CommentsSection
          locale={locale}
          targetType="post"
          targetId={post.id}
          slug={post.slug}
          comments={comments}
          user={user}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
