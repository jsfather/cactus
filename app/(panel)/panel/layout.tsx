import { PanelNav } from "@/components/panel/panel-nav";
import { requireUser } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { notifications } from "@/lib/db/schema";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, locale] = await Promise.all([requireUser(), getPanelLocale()]);
  const [{unread}] = await getDatabase().select({unread:sql<number>`count(*)::int`}).from(notifications).where(and(eq(notifications.userId,user.id),isNull(notifications.readAt)));

  return (
    <div className="panel-workspace min-h-dvh bg-zinc-50 lg:flex dark:bg-zinc-900">
      <PanelNav user={user} locale={locale} unreadCount={unread} />
      <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-8 xl:px-10 xl:py-10">
        {children}
      </main>
    </div>
  );
}
