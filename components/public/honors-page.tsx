import { connection } from "next/server";
import { HonorCard } from "@/components/honors/honor-card";
import { getPublishedHonors } from "@/lib/honors/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PageIntro, EmptyState } from "./design";
import { Reveal } from "./public-motion";
export async function HonorsPage({ locale }: { locale: Locale }) {
  await connection();
  const d = getDictionary(locale);
  const honors = await getPublishedHonors();
  return (
    <div className="public-site">
      <SiteHeader locale={locale} currentPath="/honors" />
      <main id="public-main">
        <PageIntro
          locale={locale}
          kind="honors"
          index="05"
          eyebrow={
            locale === "fa"
              ? "آرشیو دستاوردهای کاکتوس"
              : "THE ACHIEVEMENT ARCHIVE"
          }
          title={d.honorsTitle}
          description={d.honorsDescription}
        />
        <section className="public-wrap public-section">
          {honors.length ? (
            <Reveal className="honor-list">
              {honors.map((item) => (
                <HonorCard key={item.id} honor={item} locale={locale} headingLevel={2} />
              ))}
            </Reveal>
          ) : (
            <EmptyState>{d.emptyHonors}</EmptyState>
          )}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
