import { requireRole } from "@/lib/auth/session";
import { PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getLocalizedUserName } from "@/lib/users/name";
import { isStudentInformationApproved } from "@/lib/student-information/queries";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const [user, locale] = await Promise.all([requireRole("student"), getPanelLocale()]);
  if (!(await isStudentInformationApproved(user.id))) {
    redirect("/panel/student/information");
  }
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={dictionary.dashboard.studentEyebrow}
        title={`${dictionary.dashboard.hello}، ${getLocalizedUserName(user, locale)}`}
        description={dictionary.dashboard.studentDescription}
      />
      <PanelSurface>
        <div className="p-6 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {dictionary.dashboard.comingSoon}
        </div>
      </PanelSurface>
    </PanelPage>
  );
}
