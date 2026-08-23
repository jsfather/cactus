import Link from "next/link";
import { UserAvatar } from "@/components/users/user-avatar";
import { richTextToPlainText } from "@/lib/content/rich-text";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocalizedUserName } from "@/lib/users/name";
import type { getPublicTeachers } from "@/lib/teacher-profiles/queries";

type TeacherCardValue = Awaited<ReturnType<typeof getPublicTeachers>>[number];

function localized(en: string | null, fa: string, locale: Locale) {
  return locale === "en" ? en || fa : fa;
}

export function PublicTeacherCard({ teacher, locale }: { teacher: TeacherCardValue; locale: Locale }) {
  const dictionary = getDictionary(locale);
  const localizedName = getLocalizedUserName(teacher, locale);
  const name = localizedName || (locale === "fa" ? "مدرس کاکتوس" : "Cactus Teacher");
  const biography = richTextToPlainText(localized(teacher.biographyEn, teacher.biographyFa, locale));
  const firstPosition = teacher.workExperiences[0]
    ? localized(teacher.workExperiences[0].positionEn, teacher.workExperiences[0].positionFa, locale)
    : (locale === "fa" ? "مدرس رباتیک" : "Robotics teacher");
  const city = localized(teacher.cityEn, teacher.cityFa, locale);

  return <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/8 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-800">
    <div className="flex items-center gap-4 border-b border-zinc-100 p-5 dark:border-zinc-800">
      <UserAvatar name={name} src={teacher.avatarUrl} className="size-18 shrink-0 ring-4 ring-emerald-50 dark:ring-emerald-950" />
      <div className="min-w-0 text-start">
        <h3 className="truncate text-xl font-bold text-zinc-950 dark:text-zinc-50">{name}</h3>
        <p className="mt-1 truncate text-sm font-medium text-emerald-700 dark:text-emerald-400">{firstPosition}</p>
        <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{city}</p>
      </div>
    </div>
    <div className="p-5 text-start">
      <p className="line-clamp-3 min-h-18 text-sm leading-6 text-zinc-600 dark:text-zinc-400" dir={locale === "en" && !teacher.biographyEn ? "rtl" : undefined}>{biography}</p>
      {teacher.skills.length ? <ul className="mt-4 flex flex-wrap gap-2" aria-label={dictionary.teacherSkills}>{teacher.skills.slice(0, 3).map((skill) => <li key={skill.id} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">{localized(skill.nameEn, skill.nameFa, locale)}</li>)}</ul> : null}
      <Link href={localizePath(locale, `/teachers/${teacher.username}`)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800 dark:text-emerald-400 dark:group-hover:text-emerald-300">{dictionary.viewTeacher}<span aria-hidden="true" className="rtl:rotate-180">→</span></Link>
    </div>
  </article>;
}
