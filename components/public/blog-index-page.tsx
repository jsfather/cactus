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
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} currentPath="/blog" />
      <main>
        <header className="relative isolate overflow-hidden border-b border-emerald-950/10 bg-emerald-50 dark:border-white/10 dark:bg-emerald-950/30">
          <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgb(5_150_105_/_0.22)_1px,transparent_0)] [background-size:28px_28px] dark:opacity-20" />
          <div className="absolute -end-24 -top-40 -z-10 size-96 rounded-full bg-amber-300/25 blur-3xl dark:bg-emerald-500/10" />
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <p className="inline-flex rounded-full border border-emerald-700/15 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-800 backdrop-blur dark:border-emerald-400/20 dark:bg-emerald-950/70 dark:text-emerald-300">
              {dictionary.school}
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              {dictionary.blogTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {dictionary.blogDescription}
            </p>
          </div>
        </header>

        <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
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
