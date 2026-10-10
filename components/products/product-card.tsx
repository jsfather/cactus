/* eslint-disable @next/next/no-img-element -- Managed media can use arbitrary validated remote hosts. */
import Link from "next/link";
import type { getPublishedProducts } from "@/lib/products/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { Arrow, CircuitMark } from "@/components/public/design";
type ProductSummary = Awaited<ReturnType<typeof getPublishedProducts>>[number];
export function ProductCard({
  product,
  locale,
  headingLevel = 3,
}: {
  product: ProductSummary;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const d = getDictionary(locale);
  const title =
    locale === "en" ? product.titleEn || product.titleFa : product.titleFa;
  const summary =
    locale === "en"
      ? product.summaryEn || product.summaryFa
      : product.summaryFa;
  const href = localizePath(locale, `/shop/${product.slug}`);
  return (
    <article className="public-product">
      <Link href={href} className="product-visual" aria-label={title}>
        {product.coverImageUrl ? (
          <img src={product.coverImageUrl} alt="" loading="lazy" />
        ) : (
          <span className="product-placeholder">
            <CircuitMark />
          </span>
        )}
        {product.isFeatured && (
          <span className="product-badge">
            {locale === "fa" ? "منتخب کاکتوس" : "CACTUS PICK"}
          </span>
        )}
      </Link>
      <div className="product-copy">
        <Heading dir={locale === "en" && !product.titleEn ? "rtl" : undefined}>
          <Link href={href}>{title}</Link>
        </Heading>
        <p
          className="line-clamp-2"
          dir={locale === "en" && !product.summaryEn ? "rtl" : undefined}
        >
          {summary}
        </p>
        <p className="text-xs">
          {product.inventory > 0 ? d.inStock : d.outOfStock}
        </p>
        <div className="product-bottom">
          <strong>
            {new Intl.NumberFormat(localeConfig[locale].dateLocale).format(
              product.price,
            )}{" "}
            <span className="text-xs font-normal">{d.toman}</span>
          </strong>
          <Link href={href}>
            {d.viewProduct} <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}
