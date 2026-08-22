import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { RichContent } from "@/components/content/rich-content";
import { CommentsSection } from "@/components/comments/comments-section";
import { PublicVariantPicker } from "@/components/products/public-variant-picker";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getCurrentUser } from "@/lib/auth/session";
import { getContentComments } from "@/lib/comments/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getPublishedProduct } from "@/lib/products/queries";

export async function ProductPage({ locale, slug }: { locale: Locale; slug: string }) {
  await connection();
  const product = await getPublishedProduct(slug, locale);
  if (!product) notFound();
  const user = await getCurrentUser();
  const comments = await getContentComments({ productId: product.id }, user?.id);
  const dictionary = getDictionary(locale);
  const title = locale === "en" ? product.titleEn || product.titleFa : product.titleFa;
  const summary = locale === "en" ? product.summaryEn || product.summaryFa : product.summaryFa;
  const content = locale === "en" ? product.contentEn || product.contentFa : product.contentFa;
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
              {product.categories.length ? (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={locale === "fa" ? "دسته‌بندی‌ها" : "Categories"}>
                  {product.categories.map((category) => (
                    <li key={category.id} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {locale === "en" ? category.titleEn || category.titleFa : category.titleFa}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{summary}</p>
              <PublicVariantPicker locale={locale} basePrice={product.price} baseInventory={product.inventory} variants={product.variants} />
            </div>
          </div>
        </section>
        <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20"><RichContent html={content} className="text-lg leading-9 text-zinc-700 dark:text-zinc-300" /></article>
        <CommentsSection locale={locale} targetType="product" targetId={product.id} slug={product.slug} comments={comments} user={user} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
