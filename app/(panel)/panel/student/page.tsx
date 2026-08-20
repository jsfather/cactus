import { requireRole } from "@/lib/auth/session";
import { PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";

export default async function StudentDashboard() {
  const user = await requireRole("student");

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow="پنل دانش‌آموز"
        title={`سلام، ${user.name}`}
        description="مسیر یادگیری، کلاس‌ها و پروژه‌های رباتیک شما در این بخش قرار می‌گیرد."
      />
      <PanelSurface>
        <div className="p-6 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          فضای یادگیری دانش‌آموز آماده است و قابلیت‌های بعدی با همین طراحی یکپارچه
          به آن اضافه می‌شوند.
        </div>
      </PanelSurface>
    </PanelPage>
  );
}
