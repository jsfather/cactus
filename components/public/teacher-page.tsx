import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { RichContent } from "@/components/content/rich-content";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { UserAvatar } from "@/components/users/user-avatar";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeConfig, localizePath, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/site";
import { getPublicTeacher } from "@/lib/teacher-profiles/queries";
import { getLocalizedUserName } from "@/lib/users/name";

function localized(en: string | null, fa: string, locale: Locale) { return locale === "en" ? en || fa : fa; }
function optionalLocalized(en: string | null, fa: string | null, locale: Locale) { return locale === "en" ? en || fa || "" : fa || ""; }

export async function TeacherPage({ locale, username }: { locale: Locale; username: string }) {
  await connection();
  const teacher = await getPublicTeacher(username);
  if (!teacher) notFound();
  const dictionary = getDictionary(locale);
  const name = getLocalizedUserName(teacher, locale) || (locale === "fa" ? "مدرس کاکتوس" : "Cactus Teacher");
  const city = localized(teacher.cityEn, teacher.cityFa, locale);
  const biography = localized(teacher.biographyEn, teacher.biographyFa, locale);
  const about = localized(teacher.aboutEn, teacher.aboutFa, locale);
  const achievements = optionalLocalized(teacher.achievementsEn, teacher.achievementsFa, locale);
  const memberSince = new Intl.DateTimeFormat(localeConfig[locale].dateLocale, { year: "numeric", month: "long" }).format(new Date(`${teacher.memberSince}T00:00:00Z`));
  const firstPosition = teacher.workExperiences[0] ? localized(teacher.workExperiences[0].positionEn, teacher.workExperiences[0].positionFa, locale) : (locale === "fa" ? "مدرس رباتیک" : "Robotics teacher");
  const fallbackRtl = (englishValue: string | null) => locale === "en" && !englishValue ? "rtl" : undefined;
  const pathname = `${locale === "en" ? "/en" : ""}/teachers/${teacher.username}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "Person", name, image: teacher.avatarUrl || undefined, jobTitle: firstPosition, worksFor: { "@type": "Organization", name: locale === "fa" ? "مدرسه رباتیک کاکتوس" : "Cactus Robotics School" }, url: absoluteUrl(pathname) };

  return <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
    <SiteHeader locale={locale} currentPath={`/teachers/${teacher.username}`} />
    <main>
      <article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <header className="border-b border-emerald-950/10 bg-emerald-50 dark:border-white/10 dark:bg-emerald-950/25">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[auto_minmax(0,1fr)] lg:px-10">
            <UserAvatar name={name} src={teacher.avatarUrl} className="size-36 ring-8 ring-white shadow-xl shadow-emerald-950/10 sm:size-44 dark:ring-zinc-900" />
            <div className="min-w-0 text-start">
              <Link href={localizePath(locale, "/teachers")} className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{dictionary.backToTeachers}</Link>
              <h1 className="mt-4 text-4xl font-black sm:text-5xl">{name}</h1>
              <p className="mt-3 text-lg font-semibold text-emerald-700 dark:text-emerald-400">{firstPosition}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400"><span>{city}</span><span>{dictionary.memberSince}: {memberSince}</span></div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_19rem] lg:px-10">
          <div className="min-w-0 space-y-12">
            <PublicRichSection title={dictionary.teacherBiography} html={biography} dir={fallbackRtl(teacher.biographyEn)} />
            <PublicRichSection title={dictionary.teacherAbout} html={about} dir={fallbackRtl(teacher.aboutEn)} />
            {teacher.workExperiences.length ? <ProfileSection title={dictionary.teacherExperience}><div className="space-y-4">{teacher.workExperiences.map((item) => <article key={item.id} className="rounded-2xl border border-zinc-200 p-5 text-start dark:border-zinc-800" dir={fallbackRtl(item.positionEn)}><div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-bold">{localized(item.positionEn, item.positionFa, locale)}</h3><p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">{localized(item.companyEn, item.companyFa, locale)}</p></div><span className="text-sm text-zinc-500">{localized(item.periodEn, item.periodFa, locale)}</span></div>{optionalLocalized(item.descriptionEn, item.descriptionFa, locale) ? <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">{optionalLocalized(item.descriptionEn, item.descriptionFa, locale)}</p> : null}</article>)}</div></ProfileSection> : null}
            {teacher.educations.length ? <ProfileSection title={dictionary.teacherEducation}><div className="grid gap-4 sm:grid-cols-2">{teacher.educations.map((item) => <article key={item.id} className="rounded-2xl border border-zinc-200 p-5 text-start dark:border-zinc-800" dir={fallbackRtl(item.degreeEn)}><h3 className="font-bold">{localized(item.degreeEn, item.degreeFa, locale)} · {localized(item.fieldEn, item.fieldFa, locale)}</h3><p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">{localized(item.institutionEn, item.institutionFa, locale)}</p><p className="mt-1 text-xs text-zinc-500">{localized(item.periodEn, item.periodFa, locale)}</p>{optionalLocalized(item.descriptionEn, item.descriptionFa, locale) ? <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{optionalLocalized(item.descriptionEn, item.descriptionFa, locale)}</p> : null}</article>)}</div></ProfileSection> : null}
            {achievements ? <PublicRichSection title={dictionary.teacherAchievements} html={achievements} dir={fallbackRtl(teacher.achievementsEn)} /> : null}
          </div>
          <aside className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-start lg:sticky lg:top-6 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-lg font-bold">{dictionary.teacherSkills}</h2>
            {teacher.skills.length ? <ul className="mt-5 space-y-5">{teacher.skills.map((skill) => <li key={skill.id} dir={fallbackRtl(skill.nameEn)}><div className="flex items-center justify-between gap-4 text-sm"><span className="font-medium">{localized(skill.nameEn, skill.nameFa, locale)}</span><span className="nums-en text-xs text-zinc-500" dir="ltr">{skill.score}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><span className="block h-full rounded-full bg-emerald-600 dark:bg-emerald-400" style={{ width: `${skill.score}%` }} /></div></li>)}</ul> : <p className="mt-4 text-sm text-zinc-500">—</p>}
          </aside>
        </div>
      </article>
    </main>
    <SiteFooter locale={locale} />
  </div>;
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="mb-5 text-2xl font-black">{title}</h2>{children}</section>; }
function PublicRichSection({ title, html, dir }: { title: string; html: string; dir?: "rtl" }) { return <ProfileSection title={title}><div dir={dir}><RichContent html={html} className="text-lg leading-9 text-zinc-700 dark:text-zinc-300" /></div></ProfileSection>; }
