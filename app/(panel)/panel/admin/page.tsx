import Link from "next/link";
import { PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";
import { getAdminAnalytics } from "@/lib/dashboard/admin-analytics";
import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserSectionConfig } from "@/lib/users/config";
import { getLocalizedUserName } from "@/lib/users/name";

function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}

function MetricCard({ href, label, value, detail }: { href: string; label: string; value: string; detail: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-800">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-zinc-950 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">{value}</p>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{detail}</p>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [user, locale, analytics] = await Promise.all([requireRole("admin"), getPanelLocale(), getAdminAnalytics()]);
  const dictionary = getPanelDictionary(locale);
  const number = (value: number) => formatNumber(value, locale);
  const maxDaily = Math.max(1, ...analytics.activity.map((day) => day.users + day.posts + day.products));
  const roleColors: Record<UserRole, string> = { admin: "bg-emerald-600", teacher: "bg-sky-500", student: "bg-violet-500", member: "bg-amber-500" };
  const activityLabels = { user: dictionary.dashboard.usersSeries, post: dictionary.dashboard.postsSeries, product: dictionary.dashboard.productsSeries };

  return (
    <PanelPage>
      <PanelPageHeader eyebrow={dictionary.dashboard.adminEyebrow} title={`${dictionary.dashboard.hello}، ${getLocalizedUserName(user, locale)}`} description={dictionary.dashboard.adminDescription} />

      <section aria-labelledby="overview-heading">
        <div className="mb-4">
          <h2 id="overview-heading" className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{dictionary.dashboard.overviewTitle}</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{dictionary.dashboard.overviewDescription}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard href="/panel/admin/members" label={dictionary.dashboard.totalUsers} value={number(analytics.users.total)} detail={`${number(analytics.users.active)} ${dictionary.dashboard.activeUsers}`} />
          <MetricCard href="/panel/admin/blog" label={dictionary.dashboard.publishedPosts} value={number(analytics.posts.published)} detail={`${number(analytics.posts.total)} ${dictionary.dashboard.totalPosts}`} />
          <MetricCard href="/panel/admin/products" label={dictionary.dashboard.publishedProducts} value={number(analytics.products.published)} detail={`${number(analytics.products.lowStock)} ${dictionary.dashboard.lowStock}`} />
          <MetricCard href="/panel/admin/products" label={dictionary.dashboard.uploadedMedia} value={number(analytics.media)} detail={`${number(analytics.products.total)} ${dictionary.dashboard.totalProducts}`} />
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
        <PanelSurface>
          <header className="border-b border-zinc-200 px-5 py-4 sm:px-6 dark:border-zinc-800">
            <h2 className="font-bold text-zinc-950 dark:text-zinc-50">{dictionary.dashboard.sevenDayActivity}</h2>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{dictionary.dashboard.sevenDayDescription}</p>
          </header>
          <div className="p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-emerald-500" />{dictionary.dashboard.usersSeries}</span>
              <span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-sky-500" />{dictionary.dashboard.postsSeries}</span>
              <span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-amber-500" />{dictionary.dashboard.productsSeries}</span>
            </div>
            <div className="grid h-64 grid-cols-7 items-end gap-2 sm:gap-4" role="img" aria-label={dictionary.dashboard.sevenDayDescription}>
              {analytics.activity.map((day) => {
                const total = day.users + day.posts + day.products;
                const height = total ? Math.max(10, (total / maxDaily) * 100) : 2;
                return (
                  <div key={day.date.toISOString()} className="flex h-full min-w-0 flex-col justify-end gap-2 text-center">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{number(total)}</span>
                    <div className="flex w-full flex-col justify-end overflow-hidden rounded-t-lg bg-zinc-100 dark:bg-zinc-900" style={{ height: `${height}%` }} title={`${number(total)} · ${new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium", timeZone: "UTC" }).format(day.date)}`}>
                      {day.products ? <span className="bg-amber-500" style={{ flex: day.products }} /> : null}
                      {day.posts ? <span className="bg-sky-500" style={{ flex: day.posts }} /> : null}
                      {day.users ? <span className="bg-emerald-500" style={{ flex: day.users }} /> : null}
                    </div>
                    <span className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { weekday: "short", timeZone: "UTC" }).format(day.date)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </PanelSurface>

        <PanelSurface>
          <header className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"><h2 className="font-bold text-zinc-950 dark:text-zinc-50">{dictionary.dashboard.userDistribution}</h2></header>
          <div className="space-y-5 p-5">
            {(["admin", "teacher", "student", "member"] as UserRole[]).map((role) => {
              const value = analytics.users.roles[role];
              const percentage = analytics.users.total ? (value / analytics.users.total) * 100 : 0;
              const config = getUserSectionConfig(role, locale);
              return (
                <Link key={role} href={config.path} className="block rounded-xl focus-visible:outline-none">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium text-zinc-700 dark:text-zinc-300">{config.plural}</span><span className="font-bold text-zinc-950 dark:text-zinc-50">{number(value)}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><div className={`h-full rounded-full ${roleColors[role]}`} style={{ width: `${percentage}%` }} /></div>
                </Link>
              );
            })}
          </div>
        </PanelSurface>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-2">
        <PanelSurface>
          <header className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"><h2 className="font-bold text-zinc-950 dark:text-zinc-50">{dictionary.dashboard.contentHealth}</h2></header>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Link href="/panel/admin/blog" className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900"><p className="text-sm font-medium">{dictionary.dashboard.totalPosts}</p><p className="mt-3 text-2xl font-black">{number(analytics.posts.total)}</p><p className="mt-2 text-xs text-zinc-500">{number(analytics.posts.published)} {dictionary.common.published} · {number(analytics.posts.draft)} {dictionary.common.draft}</p></Link>
            <Link href="/panel/admin/products" className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900"><p className="text-sm font-medium">{dictionary.dashboard.totalProducts}</p><p className="mt-3 text-2xl font-black">{number(analytics.products.total)}</p><p className="mt-2 text-xs text-zinc-500">{number(analytics.products.published)} {dictionary.common.published} · {number(analytics.products.draft)} {dictionary.common.draft}</p></Link>
          </div>
        </PanelSurface>

        <PanelSurface>
          <header className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"><h2 className="font-bold text-zinc-950 dark:text-zinc-50">{dictionary.dashboard.recentActivity}</h2></header>
          {analytics.recentActivity.length ? (
            <div className="divide-y divide-zinc-100 px-5 dark:divide-zinc-800">
              {analytics.recentActivity.map((item) => (
                <Link key={`${item.kind}-${item.id}`} href={item.href} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="min-w-0"><span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{locale === "fa" ? item.titleFa : item.titleEn}</span><span className="mt-1 block text-xs text-zinc-500">{activityLabels[item.kind]}</span></span>
                  <time className="shrink-0 text-xs text-zinc-500" dateTime={item.createdAt.toISOString()}>{new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric" }).format(item.createdAt)}</time>
                </Link>
              ))}
            </div>
          ) : <p className="p-5 text-sm text-zinc-500">{dictionary.dashboard.noRecentActivity}</p>}
        </PanelSurface>
      </section>
    </PanelPage>
  );
}
