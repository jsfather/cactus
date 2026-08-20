import Link from "next/link";
import { requireRole } from "@/lib/auth/session";

export default async function AdminDashboard() {
  const user = await requireRole("admin");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          پنل مدیریت
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
          سلام، {user.name}
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          محتوای عمومی و بخش‌های مدرسه رباتیک کاکتوس را از اینجا مدیریت کنید.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/panel/admin/blog"
          className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-800"
        >
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            محتوای عمومی
          </span>
          <h2 className="mt-3 text-xl font-bold text-zinc-950 group-hover:text-emerald-800 dark:text-zinc-50 dark:group-hover:text-emerald-300">
            مدیریت وبلاگ
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            نوشته‌های فارسی و انگلیسی را پیش‌نویس یا منتشر کنید.
          </p>
        </Link>
      </section>
    </div>
  );
}
