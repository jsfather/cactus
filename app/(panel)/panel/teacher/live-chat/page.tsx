import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { LiveChat } from "@/components/support/live-chat";
import { PanelPage } from "@/components/panel/ui";
export default async function ChatInbox() {
  await requireRole("teacher");
  return (
    <PanelPage>
      <LiveChat locale={await getPanelLocale()} inbox />
    </PanelPage>
  );
}
