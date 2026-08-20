import Link from "next/link";
import { connection } from "next/server";
import { PostCard } from "@/components/blog/post-card";
import { ProductCard } from "@/components/products/product-card";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getPublishedProducts } from "@/lib/products/queries";

export async function LandingPage({ locale }: { locale: Locale }) {
  await connection();
  const dictionary = getDictionary(locale);
  const [posts, products] = await Promise.all([
    getPublishedPosts(locale, 3),
    getPublishedProducts(locale, 3),
  ]);

  return (
    <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} />

      <main>
        <section className="relative isolate overflow-hidden bg-emerald-50 dark:bg-emerald-950/25">
          <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgb(5_150_105_/_0.22)_1px,transparent_0)] [background-size:28px_28px] dark:opacity-20" />
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-32">
            <div className="max-w-3xl text-start">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                {dictionary.heroEyebrow}
              </p>
              <h1 className="mt-5 text-4xl font-black leading-tight text-balance sm:text-6xl sm:leading-tight">
                {dictionary.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl dark:text-zinc-300">
                {dictionary.heroDescription}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#about"
                  className="rounded-xl bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
                >
                  {dictionary.heroAction}
                </a>
                <Link
                  href={localizePath(locale, "/blog")}
                  className="rounded-xl border border-emerald-700/20 bg-white px-6 py-3.5 font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                >
                  {dictionary.blogAction}
                </Link>
                <Link
                  href={localizePath(locale, "/shop")}
                  className="rounded-xl border border-emerald-700/20 bg-white/70 px-6 py-3.5 font-semibold text-emerald-800 transition hover:bg-white dark:border-emerald-400/20 dark:bg-zinc-900/70 dark:text-emerald-300 dark:hover:bg-zinc-900"
                >
                  {dictionary.shopAction}
                </Link>
              </div>
            </div>

            <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-8 rotate-6 rounded-[3rem] bg-emerald-700 shadow-2xl shadow-emerald-900/25 dark:bg-emerald-600" />
              <div className="absolute inset-14 -rotate-3 rounded-[2.5rem] border border-white/20 bg-emerald-950 p-8 text-white">
                <div className="grid h-full grid-cols-3 grid-rows-3 gap-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <span
                      key={item}
                      className={
                        item === 4
                          ? "grid place-items-center rounded-2xl bg-amber-300 text-4xl text-emerald-950"
                          : "rounded-2xl border border-emerald-400/25 bg-emerald-900"
                      }
                    >
                      {item === 4 ? "✦" : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <h2 className="text-3xl font-black sm:text-4xl">{dictionary.whyTitle}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {dictionary.whyItems.map(([title, description], index) => (
              <article
                key={title}
                className="rounded-3xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-emerald-950 text-white">
          <div className="absolute -start-32 top-0 size-96 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-300">{locale === "fa" ? "فروشگاه سازندگان کاکتوس" : "Cactus makers shop"}</p>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">{dictionary.featuredProducts}</h2>
                <p className="mt-3 max-w-2xl leading-7 text-emerald-100/70">{dictionary.featuredProductsDescription}</p>
              </div>
              <Link href={localizePath(locale, "/shop")} className="font-semibold text-emerald-300">{dictionary.allProducts}</Link>
            </div>
            {products.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}</div> : <p className="mt-10 rounded-2xl border border-dashed border-emerald-700 p-8 text-emerald-100/70">{dictionary.emptyProducts}</p>}
          </div>
        </section>

        <section className="bg-zinc-50 dark:bg-zinc-900/60">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">
                  {dictionary.latestPosts}
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
                  {dictionary.latestPostsDescription}
                </p>
              </div>
              <Link
                href={localizePath(locale, "/blog")}
                className="font-semibold text-emerald-700 dark:text-emerald-400"
              >
                {dictionary.allPosts}
              </Link>
            </div>

            {posts.length ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} locale={locale} />
                ))}
              </div>
            ) : (
              <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-8 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                {dictionary.emptyPosts}
              </p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
