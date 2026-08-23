import { notFound } from "next/navigation";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { DeleteTeacherProfileButton } from "@/components/teacher-profiles/delete-teacher-profile-button";
import { TeacherProfileForm, type TeacherProfileFormValues } from "@/components/teacher-profiles/teacher-profile-form";
import type { Locale } from "@/lib/i18n/config";
import { getTeacherProfileForUser } from "@/lib/teacher-profiles/queries";
import { getLocalizedUserName } from "@/lib/users/name";

function formValues(record: NonNullable<Awaited<ReturnType<typeof getTeacherProfileForUser>>>): TeacherProfileFormValues {
  const { account, profile } = record;
  return {
    mobile: account.mobile,
    firstNameFa: account.firstNameFa,
    lastNameFa: account.lastNameFa,
    firstNameEn: account.firstNameEn,
    lastNameEn: account.lastNameEn,
    email: account.email || "",
    avatarUrl: account.avatarUrl || "",
    username: profile?.username || "",
    nationalCode: profile?.nationalCode || "",
    cityFa: profile?.cityFa || "",
    cityEn: profile?.cityEn || "",
    biographyFa: profile?.biographyFa || "",
    biographyEn: profile?.biographyEn || "",
    aboutFa: profile?.aboutFa || "",
    aboutEn: profile?.aboutEn || "",
    achievementsFa: profile?.achievementsFa || "",
    achievementsEn: profile?.achievementsEn || "",
    memberSince: profile?.memberSince || new Date().toISOString().slice(0, 10),
    isPublic: profile?.isPublic || false,
    skills: record.skills.map((item) => ({ _key: item.id, nameFa: item.nameFa, nameEn: item.nameEn || "", score: item.score })),
    workExperiences: record.workExperiences.map((item) => ({ _key: item.id, companyFa: item.companyFa, companyEn: item.companyEn || "", positionFa: item.positionFa, positionEn: item.positionEn || "", periodFa: item.periodFa, periodEn: item.periodEn || "", descriptionFa: item.descriptionFa || "", descriptionEn: item.descriptionEn || "" })),
    educations: record.educations.map((item) => ({ _key: item.id, institutionFa: item.institutionFa, institutionEn: item.institutionEn || "", degreeFa: item.degreeFa, degreeEn: item.degreeEn || "", fieldFa: item.fieldFa, fieldEn: item.fieldEn || "", periodFa: item.periodFa, periodEn: item.periodEn || "", descriptionFa: item.descriptionFa || "", descriptionEn: item.descriptionEn || "" })),
  };
}

export async function TeacherProfilePage({ teacherId, locale, admin = false, saved = false }: { teacherId: string; locale: Locale; admin?: boolean; saved?: boolean }) {
  const record = await getTeacherProfileForUser(teacherId);
  if (!record) notFound();
  const isFa = locale === "fa";
  const name = getLocalizedUserName(record.account, locale) || record.account.mobile;
  const cancelHref = admin ? "/panel/admin/teachers" : "/panel/teacher";

  return <PanelPage>
    {saved ? <ToastOnMount title={isFa ? "پروفایل حرفه‌ای ذخیره شد." : "Professional profile saved."} /> : null}
    <div><PanelBackLink href={cancelHref}>{isFa ? "بازگشت" : "Back"} · {admin ? (isFa ? "مدرسین" : "Teachers") : (isFa ? "پنل مدرس" : "Teacher panel")}</PanelBackLink></div>
    <PanelPageHeader
      eyebrow={isFa ? "پروفایل حرفه‌ای مدرس" : "Teacher professional profile"}
      title={admin ? name : (isFa ? "پروفایل حرفه‌ای من" : "My professional profile")}
      description={isFa ? "اطلاعات عمومی و سوابق حرفه‌ای را مدیریت کنید. این بخش فرآیند تأیید پرونده دانش پژوهی ندارد." : "Manage public information and professional history. This section does not use the student submission review flow."}
      actions={admin && record.profile ? <DeleteTeacherProfileButton teacherId={teacherId} locale={locale} /> : undefined}
    />
    <TeacherProfileForm locale={locale} values={formValues(record)} teacherId={admin ? teacherId : undefined} cancelHref={cancelHref} />
  </PanelPage>;
}
