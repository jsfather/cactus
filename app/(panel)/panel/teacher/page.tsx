import { requireRole } from "@/lib/auth/session";
import { PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";

export default async function TeacherDashboard() {
  const user = await requireRole("teacher");

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow="پنل مدرس"
        title={`سلام، ${user.name}`}
        description="ابزارهای مدیریت کلاس‌ها، تمرین‌ها و پیشرفت دانش‌آموزان در این بخش قرار می‌گیرند."
      />
      <PanelSurface>
        <div className="p-6 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          فضای کاری مدرس آماده است و قابلیت‌های آموزشی بعدی با همین طراحی یکپارچه
          به آن اضافه می‌شوند.
        </div>
      </PanelSurface>
    </PanelPage>
  );
}
