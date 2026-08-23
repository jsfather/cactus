import { requireRole } from "@/lib/auth/session";
import { PanelDashboardCard, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getLocalizedUserName } from "@/lib/users/name";

export default async function TeacherDashboard() {
  const [user, locale] = await Promise.all([requireRole("teacher"), getPanelLocale()]);
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={dictionary.dashboard.teacherEyebrow}
        title={`${dictionary.dashboard.hello}، ${getLocalizedUserName(user, locale)}`}
        description={dictionary.dashboard.teacherDescription}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <PanelDashboardCard
          href="/panel/teacher/profile"
          eyebrow={locale === "fa" ? "معرفی عمومی" : "Public presence"}
          title={dictionary.nav.teacherProfile}
          description={locale === "fa" ? "بیوگرافی، مهارت‌ها، سوابق کاری و تحصیلات خود را مدیریت کنید." : "Manage your biography, skills, work history, and education."}
        />
      </div>
    </PanelPage>
  );
}
