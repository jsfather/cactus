"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";
import { CactusBrand } from "@/components/brand/cactus-brand";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
import { UserAvatar } from "@/components/users/user-avatar";
import { roleHome } from "@/lib/auth/roles";
import type { CurrentUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getLocalizedUserName } from "@/lib/users/name";

type NavIcon = "home" | "blog" | "shop" | "media" | "exams" | "users" | "profile";

function Icon({ name }: { name: NavIcon }) {
  const common = { viewBox: "0 0 24 24", className: "size-5", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  if (name === "home") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z" /></svg>;
  if (name === "blog") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 3h9l3 3v15H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path strokeLinecap="round" d="M8 10h6M8 14h6M8 18h4M15 3v4h4" /></svg>;
  if (name === "shop") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16l-1 12H5L4 9ZM8 9V7a4 4 0 0 1 8 0v2" /></svg>;
  if (name === "media") return <svg {...common} aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m5 18 4.5-4 3 2.5 2.5-2 4 3.5" /></svg>;
  if (name === "exams") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5h10a2 2 0 0 1 2 2V21H5V6.5a2 2 0 0 1 2-2Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5V3h6v1.5M8.5 10l1.5 1.5 2.5-3M8.5 16h7" /></svg>;
  if (name === "users") return <svg {...common} aria-hidden="true"><circle cx="9" cy="8" r="3" /><path strokeLinecap="round" d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M16.5 15a5 5 0 0 1 4 5" /></svg>;
  return <svg {...common} aria-hidden="true"><circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

export function PanelNav({ user, locale }: { user: CurrentUser; locale: Locale }) {
  const pathname = usePathname();
  const dictionary = getPanelDictionary(locale);
  const userName = getLocalizedUserName(user, locale);
  const alternateLocale = locale === "fa" ? "en" : "fa";
  const alternateHref = `/api/preferences/locale?locale=${alternateLocale}&returnTo=${encodeURIComponent(pathname)}`;
  const roleName = locale === "fa"
    ? { admin: "همکار", teacher: "مدرس", student: "دانش پژوه", member: "عضو عادی" }[user.role]
    : { admin: "Administrator", teacher: "Teacher", student: "Student", member: "Member" }[user.role];
  const mainLinks: Array<{ href: string; label: string; icon: NavIcon }> = [
    { href: roleHome[user.role], label: dictionary.nav.overview, icon: "home" },
    ...(user.role === "admin"
      ? [
          { href: "/panel/admin/blog", label: dictionary.nav.blog, icon: "blog" as const },
          { href: "/panel/admin/products", label: dictionary.nav.shop, icon: "shop" as const },
          { href: "/panel/admin/product-categories", label: dictionary.nav.categories, icon: "shop" as const },
          { href: "/panel/admin/exams", label: dictionary.nav.exams, icon: "exams" as const },
          { href: "/panel/admin/comments", label: dictionary.nav.comments, icon: "blog" as const },
          { href: "/panel/admin/about", label: dictionary.nav.about, icon: "profile" as const },
          { href: "/panel/admin/media", label: dictionary.nav.media, icon: "media" as const },
        ]
      : []),
  ];
  const userLinks = user.role === "admin"
    ? [
        { href: "/panel/admin/admins", label: dictionary.nav.admins },
        { href: "/panel/admin/teachers", label: dictionary.nav.teachers },
        { href: "/panel/admin/students", label: dictionary.nav.students },
        { href: "/panel/admin/members", label: dictionary.nav.members },
      ]
    : [];
  const isActive = (href: string) => pathname === href || (href !== roleHome[user.role] && pathname.startsWith(`${href}/`));

  return (
    <aside className="relative z-50 flex flex-col border-b border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-e lg:px-5 lg:py-5 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link href={roleHome[user.role]} aria-label={locale === "fa" ? "پنل کاکتوس" : "Cactus panel"}>
          <CactusBrand locale={locale} subtitle={roleName} />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/panel/profile" className="lg:hidden" aria-label={dictionary.nav.profile}>
            <UserAvatar name={userName} src={user.avatarUrl} className="size-10" />
          </Link>
          <PreferencesMenu locale={locale} alternateHref={alternateHref} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto py-4 lg:block lg:flex-1 lg:overflow-y-auto">
        <p className="mb-2 hidden px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 lg:block">{dictionary.nav.workspace}</p>
        <nav className="flex gap-1.5 lg:flex-col">
          {mainLinks.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white dark:aria-[current=page]:bg-emerald-950/60 dark:aria-[current=page]:text-emerald-300">
              <Icon name={item.icon} /><span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {userLinks.length ? (
          <div className="contents lg:block">
            <p className="mb-2 mt-7 hidden px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 lg:block">{dictionary.nav.management}</p>
            <nav className="flex gap-1.5 lg:flex-col lg:space-y-1.5">
              {userLinks.map((item) => (
                <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white dark:aria-[current=page]:bg-emerald-950/60 dark:aria-[current=page]:text-emerald-300">
                  <Icon name="users" /><span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-xs lg:hidden dark:border-zinc-800">
        <a href={locale === "en" ? "/en" : "/"} className="text-zinc-500 transition hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-300">{dictionary.nav.publicSite}</a>
        <form action={logout}><button type="submit" className="text-red-600 transition hover:text-red-700 dark:text-red-400">{dictionary.nav.signOut}</button></form>
      </div>

      <div className="hidden border-t border-zinc-200 pt-4 lg:block dark:border-zinc-800">
        <Link href="/panel/profile" className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3 transition hover:bg-emerald-50 dark:bg-zinc-900 dark:hover:bg-emerald-950/50">
          <UserAvatar name={userName} src={user.avatarUrl} className="size-11" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{userName}</span>
            <span className="nums-en mt-0.5 block truncate text-xs text-zinc-500" dir="ltr">{user.mobile}</span>
          </span>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3 px-2 text-xs">
          <a href={locale === "en" ? "/en" : "/"} className="text-zinc-500 transition hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-300">{dictionary.nav.publicSite}</a>
          <form action={logout}><button type="submit" className="text-red-600 transition hover:text-red-700 dark:text-red-400">{dictionary.nav.signOut}</button></form>
        </div>
      </div>
    </aside>
  );
}
