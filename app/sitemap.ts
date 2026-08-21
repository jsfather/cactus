import { and, eq, lte } from "drizzle-orm";
import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { posts, products } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const now = new Date();
  const database = getDatabase();
  const [publishedPosts, publishedProducts] = await Promise.all([
    database
      .select({ slug: posts.slug, updatedAt: posts.updatedAt, image: posts.coverImageUrl })
      .from(posts)
      .where(and(eq(posts.status, "published"), lte(posts.publishedAt, now), eq(posts.noIndex, false))),
    database
      .select({ slug: products.slug, updatedAt: products.updatedAt, image: products.coverImageUrl })
      .from(products)
      .where(and(eq(products.status, "published"), lte(products.publishedAt, now))),
  ]);

  const localizedEntry = (
    faPath: string,
    enPath: string,
    options: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
  ): MetadataRoute.Sitemap[number][] => [
    {
      url: absoluteUrl(faPath),
      ...options,
      alternates: { languages: { fa: absoluteUrl(faPath), en: absoluteUrl(enPath) } },
    },
    {
      url: absoluteUrl(enPath),
      ...options,
      alternates: { languages: { fa: absoluteUrl(faPath), en: absoluteUrl(enPath) } },
    },
  ];

  return [
    ...localizedEntry("/", "/en", { changeFrequency: "weekly", priority: 1 }),
    ...localizedEntry("/blog", "/en/blog", { changeFrequency: "daily", priority: 0.8 }),
    ...localizedEntry("/shop", "/en/shop", { changeFrequency: "daily", priority: 0.8 }),
    ...publishedPosts.flatMap((post) => localizedEntry(
      `/blog/${post.slug}`,
      `/en/blog/${post.slug}`,
      {
        lastModified: post.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
        images: post.image ? [absoluteUrl(post.image)] : undefined,
      },
    )),
    ...publishedProducts.flatMap((product) => localizedEntry(
      `/shop/${product.slug}`,
      `/en/shop/${product.slug}`,
      {
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        images: product.image ? [absoluteUrl(product.image)] : undefined,
      },
    )),
  ];
}
