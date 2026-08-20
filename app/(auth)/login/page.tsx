import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeSelect } from "@/components/theme/theme-select";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "ورود | کاکتوس",
};

export default async function LoginPage() {
  if (await getCurrentUser()) {
    redirect("/panel");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
        >
          بازگشت به صفحه اصلی
        </Link>
        <ThemeSelect />
      </div>
      <section className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-emerald-950/5 sm:p-9 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            مدرسه رباتیک کاکتوس
          </p>
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            ورود به پنل
          </h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            مدیر، مدرس و دانش‌آموز از همین صفحه وارد فضای اختصاصی خود می‌شوند.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
