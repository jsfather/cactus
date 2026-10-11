import type { Metadata } from "next";
import { connection } from "next/server";
import { getPublishedSoftware, getSoftwareMetadata } from "./software-queries";
import { richTextToPlainText } from "@/lib/content/rich-text";
import { localizePath, type Locale } from "@/lib/i18n/config";

export async function getSoftwareSeo(
  id: string,
  locale: Locale,
): Promise<Metadata> {
  await connection();
  const item = await getPublishedSoftware(id);
  if (!item) return { robots: { index: false, follow: false } };
  const metadata = await getSoftwareMetadata(id);
  const title = locale === "en" ? item.titleEn || item.titleFa : item.titleFa;
  const description =
    (locale === "en"
      ? metadata.summaryEn || metadata.summaryFa
      : metadata.summaryFa) ||
    richTextToPlainText(
      locale === "en" ? item.contentEn || item.contentFa : item.contentFa,
    ).slice(0, 160);
  const path = `/requirements/${id}`;
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
      images: metadata.imageUrl
        ? [{ url: metadata.imageUrl, alt: title }]
        : undefined,
    },
  };
}
