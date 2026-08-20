import { requireRole } from "@/lib/auth/session";
import { PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function TeacherDashboard() {
  const [user, locale] = await Promise.all([requireRole("teacher"), getPanelLocale()]);
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={dictionary.dashboard.teacherEyebrow}
        title={`${dictionary.dashboard.hello}، ${user.name}`}
        description={dictionary.dashboard.teacherDescription}
      />
      <PanelSurface>
        <div className="p-6 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {dictionary.dashboard.comingSoon}
        </div>
      </PanelSurface>
    </PanelPage>
  );
}
