import Link from "next/link";
import type { getPublishedProducts } from "@/lib/products/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";

type ProductSummary = Awaited<ReturnType<typeof getPublishedProducts>>[number];

export function ProductCard({ product, locale }: { product: ProductSummary; locale: Locale }) {
  const dictionary = getDictionary(locale);
  const title = locale === "en" ? product.titleEn || product.titleFa : product.titleFa;
  const summary = locale === "en" ? product.summaryEn || product.summaryFa : product.summaryFa;
  const price = new Intl.NumberFormat(localeConfig[locale].dateLocale).format(product.price);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-950/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
      <Link href={localizePath(locale, `/shop/${product.slug}`)} className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-50 dark:from-emerald-950 dark:to-zinc-900">
        {product.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.coverImageUrl} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        ) : <span className="grid size-full place-items-center text-5xl text-emerald-700/40">✦</span>}
        {product.isFeatured ? <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur dark:bg-zinc-950/90 dark:text-emerald-300">★ {locale === "fa" ? "ویژه" : "Featured"}</span> : null}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold leading-8 text-zinc-950 dark:text-zinc-50">{title}</h3>
        <p className="mt-3 line-clamp-2 leading-7 text-zinc-600 dark:text-zinc-400">{summary}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p><span className="block text-xs text-zinc-500">{dictionary.price}</span><strong className="mt-1 block text-lg text-emerald-800 dark:text-emerald-300">{price} <span className="text-xs font-medium">{dictionary.toman}</span></strong></p>
          <Link href={localizePath(locale, `/shop/${product.slug}`)} className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{dictionary.viewProduct}</Link>
        </div>
      </div>
    </article>
  );
}
