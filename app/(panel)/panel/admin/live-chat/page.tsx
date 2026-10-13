import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import {
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
} from "@/components/panel/ui";
import { LiveChat } from "@/components/support/live-chat";
export default async function ChatInbox() {
  await requireRole("admin", "support");
  const locale = await getPanelLocale();
  return (
    <PanelPage>
      <PanelPageHeader
        title={locale === "fa" ? "گفت‌وگوهای آنلاین" : "Live conversations"}
        eyebrow={locale === "fa" ? "پشتیبانی" : "Support"}
        description=""
        actions={
          <PanelPrimaryLink href="/panel/admin/live-chat/settings">
            {locale === "fa" ? "تنظیمات چت" : "Chat settings"}
          </PanelPrimaryLink>
        }
      />
      <LiveChat locale={locale} inbox />
    </PanelPage>
  );
}
