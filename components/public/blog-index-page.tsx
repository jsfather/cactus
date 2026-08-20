import { connection } from "next/server";
import { PostCard } from "@/components/blog/post-card";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export async function BlogIndexPage({ locale }: { locale: Locale }) {
  await connection();
  const dictionary = getDictionary(locale);
  const posts = await getPublishedPosts(locale);

  return (
    <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} currentPath="/blog" />
      <main>
        <header className="border-b border-emerald-950/10 bg-emerald-50 dark:border-white/10 dark:bg-emerald-950/25">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              {dictionary.school}
            </p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              {dictionary.blogTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {dictionary.blogDescription}
            </p>
          </div>
        </header>

        <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          {posts.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              {dictionary.emptyPosts}
            </p>
          )}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
