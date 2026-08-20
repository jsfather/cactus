import Link from "next/link";
import type { getPublishedPosts } from "@/lib/blog/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";

type PostSummary = Awaited<ReturnType<typeof getPublishedPosts>>[number];

export function PostCard({ post, locale }: { post: PostSummary; locale: Locale }) {
  const dictionary = getDictionary(locale);
  const title = locale === "en" ? post.titleEn || post.titleFa : post.titleFa;
  const excerpt =
    locale === "en" ? post.excerptEn || post.excerptFa : post.excerptFa;
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(localeConfig[locale].dateLocale, {
        dateStyle: "medium",
      }).format(post.publishedAt)
    : null;

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
      <div className="mb-6 h-1.5 w-14 rounded-full bg-emerald-600 transition-all group-hover:w-20 dark:bg-emerald-400" />
      <h3 className="text-xl font-bold leading-8 text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-3 line-clamp-3 leading-7 text-zinc-600 dark:text-zinc-400">
        {excerpt}
      </p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-7 text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">{date}</span>
        <Link
          href={localizePath(locale, `/blog/${post.slug}`)}
          className="font-semibold text-emerald-700 transition group-hover:text-emerald-800 dark:text-emerald-400 dark:group-hover:text-emerald-300"
        >
          {dictionary.readMore}
        </Link>
      </div>
    </article>
  );
}
