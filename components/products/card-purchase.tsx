"use client";
import { useState } from "react";
import Link from "next/link";
import { AddToCart } from "@/components/workflows/cart";
import { Arrow } from "@/components/public/design";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { getPublishedProducts } from "@/lib/products/queries";
type CardPurchaseProduct = Pick<
  Awaited<ReturnType<typeof getPublishedProducts>>[number],
  | "id"
  | "slug"
  | "titleFa"
  | "titleEn"
  | "price"
  | "inventory"
  | "coverImageUrl"
  | "variantLabels"
>;

export function CardPurchase({
  product,
  locale,
}: {
  product: CardPurchaseProduct;
  locale: Locale;
}) {
  const [variantId, setVariantId] = useState(
    product.variantLabels.find((v) => v.inventory > 0)?.id ||
      product.variantLabels[0]?.id ||
      "",
  );
  const variant = product.variantLabels.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const inventory = variant?.inventory ?? product.inventory;
  return (
    <div className="card-purchase">
      {!!product.variantLabels.length && (
        <fieldset className="card-variants">
          <legend>
            {locale === "fa" ? "انتخاب تنوع" : "Choose an option"}
          </legend>
          <div>
            {product.variantLabels.map((v) => (
              <button
                type="button"
                aria-pressed={v.id === variantId}
                onClick={() => setVariantId(v.id)}
                key={v.id}
              >
                {locale === "en" ? v.titleEn || v.titleFa : v.titleFa}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <div className="product-bottom">
        <strong>
          {price.toLocaleString(locale)}{" "}
          <small>{locale === "fa" ? "تومان" : "toman"}</small>
        </strong>
        <AddToCart
          iconOnly
          locale={locale}
          inventory={inventory}
          item={{
            productId: product.id,
            variantId: variant?.id || "",
            titleFa: product.titleFa + (variant ? ` · ${variant.titleFa}` : ""),
            titleEn:
              (product.titleEn || product.titleFa) +
              (variant ? ` · ${variant.titleEn || variant.titleFa}` : ""),
            price,
            imageUrl: product.coverImageUrl || undefined,
            slug: product.slug,
          }}
        />
      </div>
      <Link
        className="product-detail-link"
        href={localizePath(locale, `/shop/${product.slug}`)}
      >
        {locale === "fa" ? "مشاهده و بررسی محصول" : "Explore this product"}
        <Arrow />
      </Link>
    </div>
  );
}
