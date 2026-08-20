"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";
import { ThemeSelect } from "@/components/theme/theme-select";
import type { CurrentUser } from "@/lib/auth/session";
import { roleHome, roleLabels } from "@/lib/auth/roles";

const roleLinks = {
  admin: [
    { href: "/panel/admin", label: "نمای کلی" },
    { href: "/panel/admin/blog", label: "مدیریت وبلاگ" },
    { href: "/panel/admin/admins", label: "مدیران" },
    { href: "/panel/admin/teachers", label: "مدرسان" },
    { href: "/panel/admin/students", label: "دانش‌آموزان" },
  ],
  teacher: [{ href: "/panel/teacher", label: "نمای کلی" }],
  student: [{ href: "/panel/student", label: "نمای کلی" }],
};

export function PanelNav({ user }: { user: CurrentUser }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col border-b border-zinc-200 bg-white px-5 py-5 lg:min-h-dvh lg:w-72 lg:border-b-0 lg:border-e lg:px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-4 lg:block">
        <Link href={roleHome[user.role]} className="inline-flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-700 text-lg font-black text-white dark:bg-emerald-500 dark:text-emerald-950">
            ک
          </span>
          <span>
            <span className="block font-bold text-zinc-950 dark:text-zinc-50">
              پنل کاکتوس
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
              {roleLabels[user.role]}
            </span>
          </span>
        </Link>

        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-emerald-700 lg:hidden dark:text-zinc-400 dark:hover:text-emerald-400"
        >
          مشاهده سایت
        </Link>
      </div>

      <nav className="mt-5 flex gap-2 overflow-x-auto lg:mt-10 lg:flex-col">
        {roleLinks[user.role].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              pathname === item.href ||
              (item.href !== roleHome[user.role] &&
                pathname.startsWith(`${item.href}/`))
                ? "page"
                : undefined
            }
            className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-800 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-800 lg:w-full dark:text-zinc-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 dark:aria-[current=page]:bg-emerald-950/50 dark:aria-[current=page]:text-emerald-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-5 border-t border-zinc-200 pt-5 lg:mt-auto lg:pt-6 dark:border-zinc-800">
        <ThemeSelect />
        <p className="mt-4 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {user.name}
        </p>
        <p className="nums-en mt-1 truncate text-xs text-zinc-500" dir="ltr">
          {user.email}
        </p>
        <div className="mt-4 flex gap-3 lg:flex-col">
          <Link
            href="/"
            className="hidden text-sm text-zinc-500 transition hover:text-emerald-700 lg:block dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            مشاهده سایت عمومی
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-red-600 transition hover:text-red-700 dark:text-red-400"
            >
              خروج از حساب
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
