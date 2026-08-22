import { connection } from "next/server";
import { ProductCard } from "@/components/products/product-card";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getProductCategories } from "@/lib/catalog/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getPublishedProducts } from "@/lib/products/queries";
import Link from "next/link";

export async function ShopIndexPage({ locale, category }: { locale: Locale; category?: string }) {
  await connection();
  const [products, categories, dictionary] = await Promise.all([getPublishedProducts(locale, undefined, category), getProductCategories(), Promise.resolve(getDictionary(locale))]);
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} currentPath="/shop" />
      <main>
        <header className="relative isolate overflow-hidden border-b border-emerald-950/10 bg-emerald-950 text-white dark:border-white/10">
          <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgb(52_211_153_/_0.35)_1px,transparent_0)] [background-size:28px_28px]" />
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-900/70 px-4 py-2 text-sm text-emerald-200">{locale === "fa" ? "فروشگاه سازندگان کاکتوس" : "Cactus makers shop"}</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">{dictionary.shopTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-100/80">{dictionary.shopDescription}</p>
          </div>
        </header>
        <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          {categories.length ? <nav className="mb-8 flex flex-wrap gap-2" aria-label={locale === "fa" ? "فیلتر دسته‌بندی" : "Category filter"}><Link href={localizePath(locale, "/shop")} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${!category ? "border-emerald-700 bg-emerald-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"}`}>{locale === "fa" ? "همه" : "All"}</Link>{categories.map((item) => <Link key={item.id} href={`${localizePath(locale, "/shop")}?category=${encodeURIComponent(item.slug)}`} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item.slug ? "border-emerald-700 bg-emerald-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"}`}>{locale === "en" ? item.titleEn || item.titleFa : item.titleFa}</Link>)}</nav> : null}
          {products.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}</div> : <p className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">{dictionary.emptyProducts}</p>}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
