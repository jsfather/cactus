import { and, eq, lte } from "drizzle-orm";
import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getDatabase } from "@/lib/db/client";
import { coursePages, honors, posts, products, teacherProfiles, users } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const now = new Date();
  const database = getDatabase();
  const [publishedPosts, publishedProducts, publicTeachers, publishedHonors] = await Promise.all([
    database
      .select({ slug: posts.slug, updatedAt: posts.updatedAt, image: posts.coverImageUrl })
      .from(posts)
      .where(and(eq(posts.status, "published"), lte(posts.publishedAt, now), eq(posts.noIndex, false))),
    database
      .select({ slug: products.slug, updatedAt: products.updatedAt, image: products.coverImageUrl })
      .from(products)
      .where(and(eq(products.status, "published"), lte(products.publishedAt, now))),
    database
      .select({ username: teacherProfiles.username, updatedAt: teacherProfiles.updatedAt, image: users.avatarUrl })
      .from(teacherProfiles)
      .innerJoin(users, eq(users.id, teacherProfiles.userId))
      .where(and(eq(teacherProfiles.isPublic, true), eq(users.isActive, true), eq(users.role, "teacher"))),
    database
      .select({ slug: honors.slug, updatedAt: honors.updatedAt, image: honors.certificateImageUrl })
      .from(honors)
      .where(and(eq(honors.status, "published"), lte(honors.publishedAt, now))),
  ]);

  const publishedCourses = await database.select().from(coursePages).where(eq(coursePages.status, "published"));

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
    ...localizedEntry("/courses", "/en/courses", { changeFrequency: "weekly", priority: 0.9 }),
    ...localizedEntry("/requirements", "/en/requirements", { changeFrequency: "monthly", priority: 0.6 }),
    ...publishedCourses.flatMap(c => localizedEntry(`/courses/${c.slug}`, `/en/courses/${c.slug}`, { lastModified: c.updatedAt, priority: 0.8 })),
    ...localizedEntry("/blog", "/en/blog", { changeFrequency: "daily", priority: 0.8 }),
    ...localizedEntry("/shop", "/en/shop", { changeFrequency: "daily", priority: 0.8 }),
    ...localizedEntry("/teachers", "/en/teachers", { changeFrequency: "weekly", priority: 0.8 }),
    ...localizedEntry("/honors", "/en/honors", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/about", "/en/about", { changeFrequency: "monthly", priority: 0.7 }),
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
    ...publicTeachers.flatMap((teacher) => localizedEntry(
      `/teachers/${teacher.username}`,
      `/en/teachers/${teacher.username}`,
      {
        lastModified: teacher.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
        images: teacher.image ? [absoluteUrl(teacher.image)] : undefined,
      },
    )),
    ...publishedHonors.flatMap((honor) => localizedEntry(
      `/honors/${honor.slug}`,
      `/en/honors/${honor.slug}`,
      {
        lastModified: honor.updatedAt,
        changeFrequency: "yearly",
        priority: 0.7,
        images: [absoluteUrl(honor.image)],
      },
    )),
  ];
}
