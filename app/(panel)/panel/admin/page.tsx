import {
  PanelDashboardCard,
  PanelPage,
  PanelPageHeader,
} from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";

export default async function AdminDashboard() {
  const user = await requireRole("admin");

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow="پنل مدیریت"
        title={`سلام، ${user.name}`}
        description="محتوای عمومی و حساب‌های مدرسه رباتیک کاکتوس را از اینجا مدیریت کنید."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <PanelDashboardCard
          href="/panel/admin/blog"
          eyebrow="محتوای عمومی"
          title="مدیریت وبلاگ"
          description="نوشته‌های فارسی و انگلیسی را ایجاد، ویرایش و منتشر کنید."
        />
        <PanelDashboardCard
          href="/panel/admin/admins"
          eyebrow="مدیریت کاربران"
          title="مدیران"
          description="حساب‌های مدیریتی و دسترسی کامل سامانه را مدیریت کنید."
        />
        <PanelDashboardCard
          href="/panel/admin/teachers"
          eyebrow="مدیریت کاربران"
          title="مدرسان"
          description="حساب‌ها و وضعیت دسترسی مدرسان مدرسه را مدیریت کنید."
        />
        <PanelDashboardCard
          href="/panel/admin/students"
          eyebrow="مدیریت کاربران"
          title="دانش‌آموزان"
          description="حساب‌ها و وضعیت دسترسی دانش‌آموزان را مدیریت کنید."
        />
      </section>
    </PanelPage>
  );
}
