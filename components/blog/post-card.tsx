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
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
      {post.coverImageUrl ? (
        <Link href={localizePath(locale, `/blog/${post.slug}`)} className="block aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImageUrl} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
      ) : <div className="h-2 bg-gradient-to-e from-emerald-700 via-emerald-400 to-amber-300" />}
      <div className="flex flex-1 flex-col p-6">
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
      </div>
    </article>
  );
}
