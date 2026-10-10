import { connection } from "next/server";
import { PublicTeacherCard } from "@/components/teacher-profiles/public-teacher-card";
import { getPublicTeachers } from "@/lib/teacher-profiles/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PageIntro, EmptyState } from "./design";
import { Reveal } from "./public-motion";
export async function TeachersPage({ locale }: { locale: Locale }) {
  await connection();
  const d = getDictionary(locale);
  const teachers = await getPublicTeachers();
  return (
    <div className="public-site">
      <SiteHeader locale={locale} currentPath="/teachers" />
      <main id="public-main">
        <PageIntro
          locale={locale}
          kind="teachers"
          index="04"
          eyebrow={
            locale === "fa"
              ? "آدم‌های پشت ایده‌ها"
              : "THE PEOPLE BEHIND THE IDEAS"
          }
          title={d.teachersTitle}
          description={d.teachersDescription}
        />
        <section className="public-wrap public-section">
          {teachers.length ? (
            <Reveal className="teacher-grid">
              {teachers.map((item) => (
                <PublicTeacherCard
                  key={item.id}
                  teacher={item}
                  locale={locale}
              headingLevel={2}
                />
              ))}
            </Reveal>
          ) : (
            <EmptyState>{d.emptyTeachers}</EmptyState>
          )}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
