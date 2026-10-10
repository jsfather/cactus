import { connection } from "next/server";
import { PostCard } from "@/components/blog/post-card";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PageIntro, EmptyState } from "./design";
import { Reveal } from "./public-motion";
export async function BlogIndexPage({ locale }: { locale: Locale }) {
  await connection();
  const d = getDictionary(locale);
  const posts = await getPublishedPosts(locale);
  return (
    <div className="public-site">
      <SiteHeader locale={locale} currentPath="/blog" />
      <main id="public-main">
        <PageIntro
          locale={locale}
          kind="blog"
          index="03"
          eyebrow={locale === "fa" ? "دفتر کنجکاوی" : "THE CURIOSITY JOURNAL"}
          title={d.blogTitle}
          description={d.blogDescription}
        />
        <section className="public-wrap public-section">
          {posts.length ? (
            <Reveal className="editorial-grid">
              {posts.map((item) => (
                <PostCard key={item.id} post={item} locale={locale} />
              ))}
            </Reveal>
          ) : (
            <EmptyState>{d.emptyPosts}</EmptyState>
          )}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
