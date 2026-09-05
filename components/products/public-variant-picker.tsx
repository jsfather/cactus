"use client";

import { AddToCart } from "@/components/workflows/cart";
import { useState } from "react";
import type { ProductVariant } from "@/lib/db/schema";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, type Locale } from "@/lib/i18n/config";

export function PublicVariantPicker({
  locale,
  product,
  basePrice,
  baseInventory,
  variants,
}: {
  locale: Locale;
  product: { id: string; titleFa: string; titleEn: string | null };
  basePrice: number;
  baseInventory: number;
  variants: ProductVariant[];
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const selected = variants.find((variant) => variant.id === selectedId);
  const price = selected?.price ?? basePrice;
  const inventory = selected ? selected.inventory : baseInventory;
  const dictionary = getDictionary(locale);
  const formattedPrice = new Intl.NumberFormat(
    localeConfig[locale].dateLocale,
  ).format(price);

  return (
    <div className="mt-8 space-y-4">
      {variants.length ? (
        <fieldset>
          <legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {locale === "fa" ? "انتخاب تنوع محصول" : "Choose a variant"}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant) => {
              const selectedVariant = variant.id === selectedId;
              const title =
                locale === "en"
                  ? variant.titleEn || variant.titleFa
                  : variant.titleFa;
              return (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={selectedVariant}
                  onClick={() => setSelectedId(variant.id)}
                  className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    selectedVariant
                      ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                  }`}
                >
                  {title}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <p>
          <span className="block text-sm text-zinc-500">
            {dictionary.price}
          </span>
          <strong className="mt-1 block text-2xl text-emerald-800 dark:text-emerald-300">
            {formattedPrice} <span className="text-sm">{dictionary.toman}</span>
          </strong>
          {selected ? (
            <span
              className="nums-en mt-1 block text-xs text-zinc-500"
              dir="ltr"
            >
              SKU: {selected.sku}
            </span>
          ) : null}
        </p>
        <span
          className={
            inventory > 0
              ? "rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "rounded-full bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300"
          }
        >
          {inventory > 0 ? dictionary.inStock : dictionary.outOfStock}
        </span>
      </div>
      <AddToCart
        locale={locale}
        inventory={inventory}
        item={{
          productId: product.id,
          variantId: selected?.id ?? "",
          titleFa: product.titleFa + (selected ? ` · ${selected.titleFa}` : ""),
          titleEn:
            (product.titleEn || product.titleFa) +
            (selected ? ` · ${selected.titleEn || selected.titleFa}` : ""),
          price,
        }}
      />
    </div>
  );
}
