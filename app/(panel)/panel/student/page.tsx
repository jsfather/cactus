import { requireRole } from "@/lib/auth/session";
import { StudentDailySchedule } from "@/components/attendance/student-daily-schedule";
import { PanelPage, PanelPageHeader, PanelPrimaryLink } from "@/components/panel/ui";
import { getStudentUpcomingSessions } from "@/lib/attendance/queries";
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
  const sessions = await getStudentUpcomingSessions(user.id);

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={dictionary.dashboard.studentEyebrow}
        title={`${dictionary.dashboard.hello}، ${getLocalizedUserName(user, locale)}`}
        description={dictionary.dashboard.studentDescription}
        actions={<PanelPrimaryLink href="/panel/student/schedule">{locale === "fa" ? "برنامه هفتگی" : "Weekly schedule"}</PanelPrimaryLink>}
      />
      <StudentDailySchedule sessions={sessions} locale={locale} />
    </PanelPage>
  );
}
