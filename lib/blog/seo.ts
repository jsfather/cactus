import type { Metadata } from "next";
import { getPublishedPost } from "@/lib/blog/queries";
import type { Locale } from "@/lib/i18n/config";

export async function getPostMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const post = await getPublishedPost(slug, locale);

  if (!post) {
    return { robots: { index: false, follow: false } };
  }

  const title = locale === "en"
    ? post.seoTitleEn || post.titleEn || post.seoTitleFa || post.titleFa
    : post.seoTitleFa || post.titleFa;
  const description = locale === "en"
    ? post.seoDescriptionEn || post.excerptEn || post.seoDescriptionFa || post.excerptFa
    : post.seoDescriptionFa || post.excerptFa;
  const pathname = `${locale === "en" ? "/en" : ""}/blog/${post.slug}`;
  const socialImage = post.seoImageUrl || post.coverImageUrl;

  return {
    title,
    description,
    keywords: post.tags,
    alternates: {
      canonical: post.canonicalUrl || pathname,
      languages: {
        fa: `/blog/${post.slug}`,
        en: `/en/blog/${post.slug}`,
      },
    },
    robots: post.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: post.canonicalUrl || pathname,
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorName],
      tags: post.tags,
      images: socialImage ? [{ url: socialImage, alt: title }] : undefined,
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}
