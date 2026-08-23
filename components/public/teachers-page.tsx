import { connection } from "next/server";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { PublicTeacherCard } from "@/components/teacher-profiles/public-teacher-card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getPublicTeachers } from "@/lib/teacher-profiles/queries";

export async function TeachersPage({ locale }: { locale: Locale }) {
  await connection();
  const [teachers, dictionary] = await Promise.all([getPublicTeachers(), Promise.resolve(getDictionary(locale))]);
  return <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
    <SiteHeader locale={locale} currentPath="/teachers" />
    <main>
      <header className="border-b border-emerald-950/10 bg-emerald-50 dark:border-white/10 dark:bg-emerald-950/25">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 text-start sm:px-8 sm:py-24 lg:px-10">
          <p className="font-semibold text-emerald-700 dark:text-emerald-400">{locale === "fa" ? "تیم آموزشی کاکتوس" : "The Cactus teaching team"}</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">{dictionary.teachersTitle}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">{dictionary.teachersDescription}</p>
        </div>
      </header>
      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        {teachers.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{teachers.map((teacher) => <PublicTeacherCard key={teacher.id} teacher={teacher} locale={locale} />)}</div> : <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">{dictionary.emptyTeachers}</p>}
      </section>
    </main>
    <SiteFooter locale={locale} />
  </div>;
}
