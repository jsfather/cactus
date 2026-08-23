import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/users/profile-form";
import { PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { ToastOnMount } from "@/components/feedback/toast-effects";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ updated?: string; onboarding?: string }> }) {
  const [currentUser, locale, query] = await Promise.all([requireUser(), getPanelLocale(), searchParams]);
  const dictionary = getPanelDictionary(locale);
  const [profile] = await getDatabase()
    .select({ mobile: users.mobile, firstNameFa: users.firstNameFa, lastNameFa: users.lastNameFa, firstNameEn: users.firstNameEn, lastNameEn: users.lastNameEn, email: users.email, avatarUrl: users.avatarUrl, bioFa: users.bioFa, bioEn: users.bioEn })
    .from(users)
    .where(eq(users.id, currentUser.id))
    .limit(1);

  if (!profile) notFound();

  return (
    <PanelPage>
      <PanelPageHeader eyebrow={dictionary.profile.eyebrow} title={query.onboarding === "1" ? (locale === "fa" ? "تکمیل پروفایل" : "Complete your profile") : dictionary.profile.title} description={query.onboarding === "1" ? (locale === "fa" ? "برای ادامه، نام فارسی خود را وارد کنید. ساخت رمز عبور اختیاری است." : "Enter your Persian name to continue. Creating a password is optional.") : dictionary.profile.description} />
      {query.updated === "1" ? <ToastOnMount title={dictionary.profile.saved} /> : null}
      <ProfileForm locale={locale} profile={profile} onboarding={query.onboarding === "1"} />
    </PanelPage>
  );
}
