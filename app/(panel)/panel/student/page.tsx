import { requireRole } from "@/lib/auth/session";

export default async function StudentDashboard() {
  const user = await requireRole("student");

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        پنل دانش‌آموز
      </p>
      <h1 className="mt-2 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
        سلام، {user.name}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
        مسیر یادگیری، کلاس‌ها و پروژه‌های رباتیک شما در این بخش قرار می‌گیرد.
      </p>
    </div>
  );
}
