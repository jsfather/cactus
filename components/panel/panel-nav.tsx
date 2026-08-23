"use client";

import { useState } from "react";
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

type NavIcon =
  | "home"
  | "blog"
  | "shop"
  | "categories"
  | "media"
  | "exams"
  | "comments"
  | "about"
  | "users"
  | "profile"
  | "studentInfo"
  | "teacherProfile"
  | "honors";

type NavItem = { href: string; label: string; icon: NavIcon };
type NavGroup = { id: string; label: string; icon: NavIcon; items: NavItem[] };

function Icon({ name, className = "size-5" }: { name: NavIcon; className?: string }) {
  const common = { viewBox: "0 0 24 24", className, fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  if (name === "home") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z" /></svg>;
  if (name === "blog") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 3h9l3 3v15H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path strokeLinecap="round" d="M8 10h6M8 14h6M8 18h4M15 3v4h4" /></svg>;
  if (name === "shop") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16l-1 12H5L4 9ZM8 9V7a4 4 0 0 1 8 0v2" /></svg>;
  if (name === "categories") return <svg {...common} aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></svg>;
  if (name === "media") return <svg {...common} aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m5 18 4.5-4 3 2.5 2.5-2 4 3.5" /></svg>;
  if (name === "exams") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5h10a2 2 0 0 1 2 2V21H5V6.5a2 2 0 0 1 2-2Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5V3h6v1.5M8.5 10l1.5 1.5 2.5-3M8.5 16h7" /></svg>;
  if (name === "comments") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path strokeLinecap="round" d="M8 9h8M8 13h5" /></svg>;
  if (name === "about") return <svg {...common} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 11v6M12 7.5v.25" /></svg>;
  if (name === "users") return <svg {...common} aria-hidden="true"><circle cx="9" cy="8" r="3" /><path strokeLinecap="round" d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M16.5 15a5 5 0 0 1 4 5" /></svg>;
  if (name === "studentInfo") return <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3.5h14v17H5zM8 8h8M8 12h8M8 16h5" /></svg>;
  if (name === "teacherProfile") return <svg {...common} aria-hidden="true"><circle cx="12" cy="7" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 20a7 7 0 0 1 14 0M4 4h3M17 4h3M18.5 2.5v3" /></svg>;
  if (name === "honors") return <svg {...common} aria-hidden="true"><circle cx="12" cy="9" r="5" /><path strokeLinecap="round" strokeLinejoin="round" d="m8.5 13-1 8 4.5-2.5 4.5 2.5-1-8M12 6.5v5M9.5 9H14.5" /></svg>;
  return <svg {...common} aria-hidden="true"><circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

function MenuIcon({ open }: { open: boolean }) {
  return open
    ? <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="m5 5 10 10M15 5 5 15" /></svg>
    : <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="M4 6h12M4 10h12M4 14h12" /></svg>;
}

function ChevronIcon({ open }: { open: boolean }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" /></svg>;
}

const linkClass = "group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 outline-none transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-emerald-600 aria-[current=page]:bg-emerald-50 aria-[current=page]:font-semibold aria-[current=page]:text-emerald-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white dark:focus-visible:ring-emerald-400 dark:aria-[current=page]:bg-emerald-950/60 dark:aria-[current=page]:text-emerald-300";
const groupLinkClass = "flex min-h-9 w-full items-center rounded-lg px-3 py-1.5 text-[13px] font-medium text-zinc-600 outline-none transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-emerald-600 aria-[current=page]:bg-emerald-50 aria-[current=page]:font-semibold aria-[current=page]:text-emerald-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white dark:focus-visible:ring-emerald-400 dark:aria-[current=page]:bg-emerald-950/60 dark:aria-[current=page]:text-emerald-300";

export function PanelNav({ user, locale }: { user: CurrentUser; locale: Locale }) {
  const pathname = usePathname();
  const dictionary = getPanelDictionary(locale);
  const userName = getLocalizedUserName(user, locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const alternateLocale = locale === "fa" ? "en" : "fa";
  const alternateHref = `/api/preferences/locale?locale=${alternateLocale}&returnTo=${encodeURIComponent(pathname)}`;
  const roleName = locale === "fa"
    ? { admin: "همکار", teacher: "مدرس", student: "دانش پژوه", member: "عضو عادی" }[user.role]
    : { admin: "Administrator", teacher: "Teacher", student: "Student", member: "Member" }[user.role];

  const overview: NavItem = { href: roleHome[user.role], label: dictionary.nav.overview, icon: "home" };
  const directLinks: NavItem[] = user.role === "student"
    ? [{ href: "/panel/student/information", label: dictionary.nav.studentInformation, icon: "studentInfo" }]
    : user.role === "teacher"
      ? [{ href: "/panel/teacher/profile", label: dictionary.nav.teacherProfile, icon: "teacherProfile" }]
      : [];
  const groups: NavGroup[] = user.role === "admin"
    ? [
        {
          id: "education",
          label: dictionary.nav.education,
          icon: "exams",
          items: [{ href: "/panel/admin/exams", label: dictionary.nav.exams, icon: "exams" }],
        },
        {
          id: "people",
          label: dictionary.nav.people,
          icon: "users",
          items: [
            { href: "/panel/admin/students", label: dictionary.nav.students, icon: "users" },
            { href: "/panel/admin/teachers", label: dictionary.nav.teachers, icon: "users" },
            { href: "/panel/admin/members", label: dictionary.nav.members, icon: "users" },
            { href: "/panel/admin/admins", label: dictionary.nav.admins, icon: "users" },
          ],
        },
        {
          id: "content",
          label: dictionary.nav.content,
          icon: "blog",
          items: [
            { href: "/panel/admin/blog", label: dictionary.nav.blog, icon: "blog" },
            { href: "/panel/admin/honors", label: dictionary.nav.honors, icon: "honors" },
            { href: "/panel/admin/media", label: dictionary.nav.media, icon: "media" },
            { href: "/panel/admin/comments", label: dictionary.nav.comments, icon: "comments" },
            { href: "/panel/admin/about", label: dictionary.nav.about, icon: "about" },
          ],
        },
        {
          id: "commerce",
          label: dictionary.nav.commerce,
          icon: "shop",
          items: [
            { href: "/panel/admin/products", label: dictionary.nav.shop, icon: "shop" },
            { href: "/panel/admin/product-categories", label: dictionary.nav.categories, icon: "categories" },
          ],
        },
      ]
    : [];
  const isActive = (href: string) => pathname === href || (href !== roleHome[user.role] && pathname.startsWith(`${href}/`));
  const activeGroup = groups.find((group) => group.items.some((item) => isActive(item.href)));
  const [openGroupId, setOpenGroupId] = useState<string | null>(() => activeGroup?.id ?? null);
  const allItems = [overview, ...directLinks, ...groups.flatMap((group) => group.items)];
  const activeItem = allItems.find((item) => isActive(item.href)) ?? overview;

  function closeMobileNavigation() {
    setMobileOpen(false);
  }

  return (
    <aside className="relative z-50 flex flex-col border-b border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:border-e lg:px-4 lg:py-5 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link href={roleHome[user.role]} aria-label={locale === "fa" ? "پنل کاکتوس" : "Cactus panel"} onClick={closeMobileNavigation}>
          <CactusBrand locale={locale} subtitle={roleName} />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/panel/profile" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 lg:hidden" aria-label={dictionary.nav.profile} onClick={closeMobileNavigation}>
            <UserAvatar name={userName} src={user.avatarUrl} className="size-10" />
          </Link>
          <PreferencesMenu locale={locale} alternateHref={alternateHref} />
        </div>
      </div>

      <div className="py-3 lg:min-h-0 lg:flex-1 lg:py-4">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="panel-navigation"
          onClick={() => setMobileOpen((current) => !current)}
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-start outline-none transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-600 lg:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Icon name={activeItem.icon} className="size-4.5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{dictionary.nav.currentSection}</span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{activeItem.label}</span>
          </span>
          <span className="grid size-9 shrink-0 place-items-center rounded-xl text-zinc-500 dark:text-zinc-400"><MenuIcon open={mobileOpen} /></span>
        </button>

        <div id="panel-navigation" className={`${mobileOpen ? "mt-3 flex" : "hidden"} max-h-[65dvh] flex-col overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl shadow-zinc-950/5 lg:mt-0 lg:flex lg:h-full lg:max-h-none lg:overflow-y-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none dark:border-zinc-800 dark:bg-zinc-950 lg:dark:bg-transparent`}>
          <p className="mb-2 px-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">{dictionary.nav.workspace}</p>
          <nav aria-label={dictionary.nav.workspace} className="space-y-1">
            <Link href={overview.href} aria-current={isActive(overview.href) ? "page" : undefined} className={linkClass} onClick={() => { setOpenGroupId(null); closeMobileNavigation(); }}>
              <span className="shrink-0 text-zinc-400 transition group-hover:text-zinc-700 group-aria-[current=page]:text-emerald-700 dark:text-zinc-500 dark:group-hover:text-zinc-200 dark:group-aria-[current=page]:text-emerald-300"><Icon name={overview.icon} className="size-4.5" /></span>
              <span className="min-w-0 flex-1 truncate">{overview.label}</span>
            </Link>
            {directLinks.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={linkClass} onClick={closeMobileNavigation}>
                <span className="shrink-0 text-zinc-400 transition group-hover:text-zinc-700 group-aria-[current=page]:text-emerald-700 dark:text-zinc-500 dark:group-hover:text-zinc-200 dark:group-aria-[current=page]:text-emerald-300"><Icon name={item.icon} className="size-4.5" /></span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </Link>
            ))}
          </nav>

          {groups.length ? <p className="mb-1 mt-4 px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">{dictionary.nav.management}</p> : null}
          <div className="space-y-1">
            {groups.map((group) => {
              const open = openGroupId === group.id;
              const groupActive = group.items.some((item) => isActive(item.href));
              const contentId = `panel-nav-${group.id}`;
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={contentId}
                    onClick={() => setOpenGroupId(open ? null : group.id)}
                    className={`flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-start text-sm font-medium outline-none transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-zinc-900 ${groupActive ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-700 dark:text-zinc-300"}`}
                  >
                    <span className={`shrink-0 ${groupActive ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"}`}><Icon name={group.icon} className="size-4.5" /></span>
                    <span className="min-w-0 flex-1 truncate">{group.label}</span>
                    <span className="shrink-0 text-zinc-400"><ChevronIcon open={open} /></span>
                  </button>
                  {open ? (
                    <nav id={contentId} aria-label={group.label} className="ms-5 mt-0.5 space-y-0.5 border-s border-zinc-200 ps-3 dark:border-zinc-800">
                      {group.items.map((item) => (
                        <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={groupLinkClass} onClick={() => { setOpenGroupId(group.id); closeMobileNavigation(); }}>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        </Link>
                      ))}
                    </nav>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-zinc-200 pt-3 text-xs lg:hidden dark:border-zinc-800">
        <a href={locale === "en" ? "/en" : "/"} className="rounded-lg px-1 py-1 text-zinc-500 outline-none transition hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-300">{dictionary.nav.publicSite}</a>
        <form action={logout}><button type="submit" className="cursor-pointer rounded-lg px-1 py-1 text-red-600 outline-none transition hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400">{dictionary.nav.signOut}</button></form>
      </div>

      <div className="hidden shrink-0 border-t border-zinc-200 pt-4 lg:block dark:border-zinc-800">
        <Link href="/panel/profile" className="group flex items-center gap-3 rounded-2xl border border-transparent bg-zinc-50 p-3 outline-none transition hover:border-emerald-200 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-zinc-900 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/50">
          <UserAvatar name={userName} src={user.avatarUrl} className="size-11 ring-2 ring-white dark:ring-zinc-800" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{userName}</span>
            <span className="nums-en mt-0.5 block truncate text-xs text-zinc-500" dir="ltr">{user.mobile}</span>
          </span>
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0 text-zinc-400 transition group-hover:text-emerald-600 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5 12.5 10 7 15.5" /></svg>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3 px-2 text-xs">
          <a href={locale === "en" ? "/en" : "/"} className="rounded-lg px-1 py-1 text-zinc-500 outline-none transition hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-300">{dictionary.nav.publicSite}</a>
          <form action={logout}><button type="submit" className="cursor-pointer rounded-lg px-1 py-1 text-red-600 outline-none transition hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400">{dictionary.nav.signOut}</button></form>
        </div>
      </div>
    </aside>
  );
}
