import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { RichContent } from "@/components/content/rich-content";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { getPublishedProduct } from "@/lib/products/queries";

export async function ProductPage({ locale, slug }: { locale: Locale; slug: string }) {
  await connection();
  const product = await getPublishedProduct(slug, locale);
  if (!product) notFound();
  const dictionary = getDictionary(locale);
  const title = locale === "en" ? product.titleEn || product.titleFa : product.titleFa;
  const summary = locale === "en" ? product.summaryEn || product.summaryFa : product.summaryFa;
  const content = locale === "en" ? product.contentEn || product.contentFa : product.contentFa;
  const price = new Intl.NumberFormat(localeConfig[locale].dateLocale).format(product.price);
  return (
    <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} currentPath={`/shop/${product.slug}`} />
      <main>
        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-100 to-amber-50 dark:from-emerald-950 dark:to-zinc-900">
              {product.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.coverImageUrl} alt="" className="size-full object-cover" />
              ) : <span className="grid size-full place-items-center text-7xl text-emerald-700/30">✦</span>}
            </div>
            <div className="self-center">
              <Link href={localizePath(locale, "/shop")} className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{dictionary.backToShop}</Link>
              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
              <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{summary}</p>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
                <p><span className="block text-sm text-zinc-500">{dictionary.price}</span><strong className="mt-1 block text-2xl text-emerald-800 dark:text-emerald-300">{price} <span className="text-sm">{dictionary.toman}</span></strong></p>
                <span className={product.inventory > 0 ? "rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "rounded-full bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300"}>{product.inventory > 0 ? dictionary.inStock : dictionary.outOfStock}</span>
              </div>
            </div>
          </div>
        </section>
        <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20"><RichContent html={content} className="text-lg leading-9 text-zinc-700 dark:text-zinc-300" /></article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
