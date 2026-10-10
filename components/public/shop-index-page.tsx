import Link from "next/link";
import { connection } from "next/server";
import { ProductCard } from "@/components/products/product-card";
import { getProductCategories } from "@/lib/catalog/queries";
import { getPublishedProducts } from "@/lib/products/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PageIntro, EmptyState } from "./design";
import { Reveal } from "./public-motion";
export async function ShopIndexPage({
  locale,
  category,
}: {
  locale: Locale;
  category?: string;
}) {
  await connection();
  const [products, categories] = await Promise.all([
    getPublishedProducts(locale, undefined, category),
    getProductCategories(),
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
          {categories.length > 0 && (
            <nav
              className="category-nav"
              aria-label={
                locale === "fa" ? "دسته‌بندی محصولات" : "Product categories"
              }
            >
              <Link
                href={localizePath(locale, "/shop")}
                aria-current={!category ? "page" : undefined}
              >
                {locale === "fa" ? "همه ابزارها" : "All tools"}
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`${localizePath(locale, "/shop")}?category=${encodeURIComponent(c.slug)}`}
                  aria-current={category === c.slug ? "page" : undefined}
                >
                  {locale === "en" ? c.titleEn || c.titleFa : c.titleFa}
                </Link>
              ))}
            </nav>
          )}
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
