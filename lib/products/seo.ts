import type { Metadata } from "next";
import { connection } from "next/server";
import { getPublishedProduct } from "./queries";
import { localizePath, type Locale } from "@/lib/i18n/config";

export async function getProductMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  await connection();
  const product = await getPublishedProduct(slug, locale);
  if (!product) return { robots: { index: false, follow: false } };
  const title =
    locale === "en" ? product.titleEn || product.titleFa : product.titleFa;
  const description =
    locale === "en"
      ? product.summaryEn || product.summaryFa
      : product.summaryFa;
  const path = `/shop/${product.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: localizePath(locale, path),
      languages: { fa: path, en: localizePath("en", path) },
    },
    openGraph: {
      title,
      description,
      url: localizePath(locale, path),
      images: product.coverImageUrl
        ? [{ url: product.coverImageUrl, alt: title }]
        : undefined,
    },
  };
}
