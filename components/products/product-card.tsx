import { formatMarketingText } from "@/lib/content/marketing";
import { RichContent } from "@/components/content/rich-content";
import { CardPurchase } from "./card-purchase";
/* eslint-disable @next/next/no-img-element -- Managed media can use arbitrary validated remote hosts. */
import Link from "next/link";
import type { getPublishedProducts } from "@/lib/products/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { CircuitMark } from "@/components/public/design";
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
        <div className="product-status-badges">
          <span className={product.availableInventory > 0 ? "badge-stock" : "badge-out"}>{product.availableInventory > 0 ? d.inStock : d.outOfStock}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && <span className="badge-sale">{Math.round((1 - product.price / product.compareAtPrice) * 100).toLocaleString(locale)}٪ {locale === "fa" ? "تخفیف" : "off"}</span>}
          {product.isFeatured && <span className="badge-featured">{locale === "fa" ? "منتخب کاکتوس" : "Cactus pick"}</span>}
        </div>
      </Link>
      <div className="product-copy">
        <Heading dir={locale === "en" && !product.titleEn ? "rtl" : undefined}>
          <Link href={href}>{title}</Link>
        </Heading>
        <RichContent
          html={formatMarketingText(summary)}
          className="line-clamp-2"
          dir={locale === "en" && !product.summaryEn ? "rtl" : undefined}
        />

        <CardPurchase product={{ id: product.id, slug: product.slug, titleFa: product.titleFa, titleEn: product.titleEn, price: product.price, inventory: product.inventory, coverImageUrl: product.coverImageUrl, variantLabels: product.variantLabels }} locale={locale} />
      </div>
    </article>
  );
}
