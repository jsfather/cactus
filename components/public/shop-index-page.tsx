import Link from "next/link";
import { PanelInput, PanelSelect, FormLabel } from "@/components/panel/form-controls";
import { connection } from "next/server";
import { ProductCard } from "@/components/products/product-card";
import { getProductCategories } from "@/lib/catalog/queries";
import { getPublishedProducts, getPublicProductTags } from "@/lib/products/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PageIntro, EmptyState } from "./design";
import { Reveal } from "./public-motion";
export async function ShopIndexPage({
  locale,
  category, q = "", tag,
}: {
  locale: Locale;
  category?: string; q?: string; tag?: string;
}) {
  await connection();
  const [products, categories, tags] = await Promise.all([
    getPublishedProducts(locale, undefined, category, q.trim(), tag),
    getProductCategories(),
    getPublicProductTags(),
  ]);
  const d = getDictionary(locale);
  return (
    <div className="public-site">
      <SiteHeader locale={locale} currentPath="/shop" />
      <main id="public-main">
        <PageIntro
          locale={locale}
          kind="shop"
          index="02"
          eyebrow={
            locale === "fa"
              ? "برای پروژه بعدی تو"
              : "FOR YOUR NEXT GREAT PROJECT"
          }
          title={d.shopTitle}
          description={d.shopDescription}
        />
        <section className="public-wrap public-section shop-catalog">
          <form action={localizePath(locale, "/shop")} className="shop-filter-form">
            <FormLabel label={locale === "fa" ? "جست‌وجوی محصول" : "Search products"}><PanelInput name="q" defaultValue={q} maxLength={100} /></FormLabel>
            <FormLabel label={locale === "fa" ? "دسته‌بندی" : "Category"}><PanelSelect name="category" defaultValue={category || ""}><option value="">{locale === "fa" ? "همه دسته‌ها" : "All categories"}</option>{categories.map(c => <option value={c.slug} key={c.id}>{locale === "en" ? c.titleEn || c.titleFa : c.titleFa}</option>)}</PanelSelect></FormLabel>
            <FormLabel label={locale === "fa" ? "برچسب" : "Tag"}><PanelSelect name="tag" defaultValue={tag || ""}><option value="">{locale === "fa" ? "همه برچسب‌ها" : "All tags"}</option>{tags.map(t => <option key={t} value={t}>{t}</option>)}</PanelSelect></FormLabel>
            <button className="public-button">{locale === "fa" ? "اعمال فیلتر" : "Apply filters"}</button><Link className="public-link" href={localizePath(locale, "/shop")}>{locale === "fa" ? "پاک‌کردن" : "Reset"}</Link>
          </form>
          <p role="status" className="mb-6 text-sm">{products.length.toLocaleString(locale)} {locale === "fa" ? "محصول" : "products"}</p>
          {products.length ? (
            <Reveal pattern="image" className="product-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  locale={locale}
                  headingLevel={2}
                />
              ))}
            </Reveal>
          ) : (
            <EmptyState>
              {category
                ? locale === "fa"
                  ? "در این دسته محصولی پیدا نشد."
                  : "No products in this category."
                : d.emptyProducts}
            </EmptyState>
          )}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
