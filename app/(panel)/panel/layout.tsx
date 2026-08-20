import { PanelNav } from "@/components/panel/panel-nav";
import { requireUser } from "@/lib/auth/session";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-zinc-50 lg:flex dark:bg-zinc-900">
      <PanelNav user={user} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        {children}
      </main>
    </div>
  );
}
