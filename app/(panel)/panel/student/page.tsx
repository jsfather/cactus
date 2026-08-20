import { requireRole } from "@/lib/auth/session";
import { PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function StudentDashboard() {
  const [user, locale] = await Promise.all([requireRole("student"), getPanelLocale()]);
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={dictionary.dashboard.studentEyebrow}
        title={`${dictionary.dashboard.hello}، ${user.name}`}
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
