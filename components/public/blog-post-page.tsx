import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getPublishedPost } from "@/lib/blog/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";

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

  return (
    <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} currentPath={`/blog/${post.slug}`} />
      <main>
        <article>
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
            </div>
          </header>

          <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
            <div className="whitespace-pre-wrap text-lg leading-9 text-zinc-700 dark:text-zinc-300">
              {content}
            </div>
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
