import { DeleteUserButton } from "@/components/users/delete-user-button";
import { UserAvatar } from "@/components/users/user-avatar";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import {
  PanelEmptyState,
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableActions,
  PanelTableActionLink,
  PanelTableCell,
  PanelEditIcon,
  PanelReviewIcon,
} from "@/components/panel/ui";
import { PanelListControls, PanelPagination } from "@/components/panel/list-controls";
import { requireRole } from "@/lib/auth/session";
import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserSectionConfig } from "@/lib/users/config";
import { getLocalizedUserName } from "@/lib/users/name";
import { getUsersByRole, type UserStatusFilter } from "@/lib/users/queries";
import { getSearchParam, parseAdminListQuery, type AdminListSearchParams } from "@/lib/panel/pagination";

function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(date);
}

export async function UserListPage({ role, searchParams }: { role: UserRole; searchParams: AdminListSearchParams }) {
  const listQuery = parseAdminListQuery(searchParams);
  const statusValue = getSearchParam(searchParams, "status");
  const status: UserStatusFilter = statusValue === "active" || statusValue === "inactive" ? statusValue : "all";
  const [currentAdmin, usersPage, locale] = await Promise.all([
    requireRole("admin"),
    getUsersByRole(role, { ...listQuery, status }),
    getPanelLocale(),
  ]);
  const dictionary = getPanelDictionary(locale);
  const config = getUserSectionConfig(role, locale);
  const studentStatusLabel = (status: "draft" | "pending" | "approved" | "rejected" | null) => {
    if (locale === "fa") return status ? { draft: "تکمیل‌نشده", pending: "در انتظار بررسی", approved: "تأییدشده", rejected: "نیازمند اصلاح" }[status] : "ارسال‌نشده";
    return status ? { draft: "Incomplete", pending: "Awaiting review", approved: "Approved", rejected: "Needs changes" }[status] : "Not submitted";
  };

  return (
    <PanelPage>
      {getSearchParam(searchParams, "toast") === "created" ? <ToastOnMount title={locale === "fa" ? "حساب کاربری ساخته شد." : "Account created."} /> : null}
      {getSearchParam(searchParams, "toast") === "updated" ? <ToastOnMount title={locale === "fa" ? "حساب کاربری به‌روز شد." : "Account updated."} /> : null}
      <PanelPageHeader
        eyebrow={dictionary.users.eyebrow}
        title={config.plural}
        description={config.description}
        actions={
          <PanelPrimaryLink href={`${config.path}/new`}>
            {locale === "fa" ? `${config.singular} جدید` : `New ${config.singular.toLowerCase()}`}
          </PanelPrimaryLink>
        }
      />

      <PanelSurface>
        <PanelListControls
          action={config.path}
          locale={locale}
          query={listQuery.q}
          searchPlaceholder={locale === "fa" ? "جست‌وجوی نام، موبایل یا ایمیل…" : "Search name, mobile, or email…"}
          filters={[{
            name: "status",
            label: dictionary.users.accountStatus,
            value: status,
            options: [
              { value: "all", label: locale === "fa" ? "همه وضعیت‌ها" : "All statuses" },
              { value: "active", label: dictionary.common.active },
              { value: "inactive", label: dictionary.common.inactive },
            ],
          }]}
        />
        {usersPage.items.length ? (
          <PanelTable
            columns={role === "student" ? [
              { label: dictionary.users.name, className: "w-[25%]" },
              { label: dictionary.users.mobile, className: "w-[18%]" },
              { label: locale === "fa" ? "وضعیت پرونده" : "Submission", className: "w-[17%]" },
              { label: dictionary.users.accountStatus, className: "w-[11%]" },
              { label: dictionary.common.createdAt, className: "w-[12%]" },
              { label: dictionary.common.actions, className: "w-[17%]" },
            ] : [
              { label: dictionary.users.name, className: "w-[28%]" },
              { label: dictionary.users.mobile, className: "w-[27%]" },
              { label: dictionary.users.accountStatus, className: "w-[13%]" },
              { label: dictionary.common.createdAt, className: "w-[17%]" },
              { label: dictionary.common.actions, className: "w-[15%]" },
            ]}
          >
            {usersPage.items.map((user) => {
              const userName = getLocalizedUserName(user, locale) || user.mobile;

              return <tr key={user.id}>
                <PanelTableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={userName} src={user.avatarUrl} className="size-10 shrink-0" />
                    <div className="min-w-0"><p className="truncate font-medium text-zinc-950 dark:text-zinc-50">{userName}</p>{user.id === currentAdmin.id ? <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">{dictionary.users.currentAccount}</p> : null}</div>
                  </div>
                </PanelTableCell>
                <PanelTableCell>
                  <span className="block truncate">
                    <bdi className="nums-en" dir="ltr">{user.mobile}</bdi>
                  </span>
                </PanelTableCell>
                {role === "student" ? <PanelTableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${user.studentInformationStatus === "approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : user.studentInformationStatus === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : user.studentInformationStatus === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>{studentStatusLabel(user.studentInformationStatus)}</span>
                </PanelTableCell> : null}
                <PanelTableCell>
                  <span
                    className={
                      user.isActive
                        ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }
                  >
                    {user.isActive ? dictionary.common.active : dictionary.common.inactive}
                  </span>
                </PanelTableCell>
                <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                  {formatDate(user.createdAt, locale)}
                </PanelTableCell>
                <PanelTableCell>
                  <PanelTableActions>
                    {role === "student" ? <PanelTableActionLink href={`${config.path}/${user.id}/information`} label={locale === "fa" ? "بررسی اطلاعات دانش پژوه" : "Review student information"} tone="copy"><PanelReviewIcon /></PanelTableActionLink> : null}
                    <PanelTableActionLink
                      href={`${config.path}/${user.id}/edit`}
                      label={dictionary.common.edit}
                    >
                      <PanelEditIcon />
                    </PanelTableActionLink>
                    <DeleteUserButton
                      role={role}
                      userId={user.id}
                      locale={locale}
                      disabled={user.id === currentAdmin.id}
                    />
                  </PanelTableActions>
                </PanelTableCell>
              </tr>;
            })}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={listQuery.q || status !== "all" ? (locale === "fa" ? "نتیجه‌ای پیدا نشد" : "No matching accounts") : (locale === "fa" ? `${config.singular}ی وجود ندارد` : `No ${config.plural.toLowerCase()} yet`)}
            description={listQuery.q || status !== "all" ? (locale === "fa" ? "عبارت جست‌وجو یا فیلترها را تغییر دهید." : "Try changing the search term or filters.") : (locale === "fa" ? `اولین حساب ${config.singular} را برای شروع این بخش بسازید.` : `Create the first ${config.singular.toLowerCase()} account to get started.`)}
            action={!listQuery.q && status === "all" ?
              <PanelPrimaryLink href={`${config.path}/new`}>
                {locale === "fa" ? `ساخت اولین ${config.singular}` : `Create first ${config.singular.toLowerCase()}`}
              </PanelPrimaryLink>
            : undefined}
          />
        )}
        <PanelPagination action={config.path} locale={locale} pagination={usersPage} query={{ ...(listQuery.q ? { q: listQuery.q } : {}), ...(status !== "all" ? { status } : {}) }} />
      </PanelSurface>
    </PanelPage>
  );
}
