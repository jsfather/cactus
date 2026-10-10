/* eslint-disable @next/next/no-img-element -- Managed media can use arbitrary validated remote hosts. */
import Link from "next/link";
import { richTextToPlainText } from "@/lib/content/rich-text";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocalizedUserName } from "@/lib/users/name";
import type { getPublicTeachers } from "@/lib/teacher-profiles/queries";
import { Arrow } from "@/components/public/design";
type TeacherCardValue = Awaited<ReturnType<typeof getPublicTeachers>>[number];
const localized = (en: string | null, fa: string, locale: Locale) =>
  locale === "en" ? en || fa : fa;
export function PublicTeacherCard({
  teacher,
  locale,
  headingLevel = 3,
}: {
  teacher: TeacherCardValue;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const d = getDictionary(locale);
  const name =
    getLocalizedUserName(teacher, locale) ||
    (locale === "fa" ? "مدرس کاکتوس" : "Cactus Teacher");
  const biography = richTextToPlainText(
    localized(teacher.biographyEn, teacher.biographyFa, locale),
  );
  const position = teacher.workExperiences[0]
    ? localized(
        teacher.workExperiences[0].positionEn,
        teacher.workExperiences[0].positionFa,
        locale,
      )
    : null;
  const href = localizePath(locale, `/teachers/${teacher.username}`);
  return (
    <article className="public-teacher">
      <Link href={href} className="teacher-portrait" aria-label={name}>
        {teacher.avatarUrl ? (
          <img src={teacher.avatarUrl} alt={name} loading="lazy" />
        ) : (
          <span aria-hidden="true">{name.slice(0, 1)}</span>
        )}
      </Link>
      <div>
        <Heading>
          <Link href={href}>{name}</Link>
        </Heading>
        {position && <p>{position}</p>}
        <p>{localized(teacher.cityEn, teacher.cityFa, locale)}</p>
        <p
          className="line-clamp-3"
          dir={locale === "en" && !teacher.biographyEn ? "rtl" : undefined}
        >
          {biography}
        </p>
        {teacher.skills.length > 0 && (
          <ul className="teacher-skills" aria-label={d.teacherSkills}>
            {teacher.skills.slice(0, 3).map((s) => (
              <li key={s.id}>{localized(s.nameEn, s.nameFa, locale)}</li>
            ))}
          </ul>
        )}
        <Link className="public-link" href={href}>
          {d.viewTeacher}
          <Arrow />
        </Link>
      </div>
    </article>
  );
}
