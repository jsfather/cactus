import {
  PanelDashboardCard,
  PanelPage,
  PanelPageHeader,
} from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserSectionConfig } from "@/lib/users/config";

export default async function AdminDashboard() {
  const [user, locale] = await Promise.all([requireRole("admin"), getPanelLocale()]);
  const dictionary = getPanelDictionary(locale);
  const adminConfig = getUserSectionConfig("admin", locale);
  const teacherConfig = getUserSectionConfig("teacher", locale);
  const studentConfig = getUserSectionConfig("student", locale);

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={dictionary.dashboard.adminEyebrow}
        title={`${dictionary.dashboard.hello}، ${user.name}`}
        description={dictionary.dashboard.adminDescription}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <PanelDashboardCard
          href="/panel/admin/blog"
          eyebrow={dictionary.blog.eyebrow}
          title={dictionary.dashboard.blogTitle}
          description={dictionary.dashboard.blogDescription}
        />
        <PanelDashboardCard
          href="/panel/admin/products"
          eyebrow={dictionary.shop.eyebrow}
          title={dictionary.dashboard.shopTitle}
          description={dictionary.dashboard.shopDescription}
        />
        <PanelDashboardCard
          href="/panel/admin/admins"
          eyebrow={dictionary.users.eyebrow}
          title={adminConfig.plural}
          description={adminConfig.description}
        />
        <PanelDashboardCard
          href="/panel/admin/teachers"
          eyebrow={dictionary.users.eyebrow}
          title={teacherConfig.plural}
          description={teacherConfig.description}
        />
        <PanelDashboardCard
          href="/panel/admin/students"
          eyebrow={dictionary.users.eyebrow}
          title={studentConfig.plural}
          description={studentConfig.description}
        />
      </section>
    </PanelPage>
  );
}
