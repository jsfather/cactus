import Link from "next/link";
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
  PanelTableCell,
} from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";
import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserSectionConfig } from "@/lib/users/config";
import { getLocalizedUserName } from "@/lib/users/name";
import { getUsersByRole } from "@/lib/users/queries";

function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(date);
}

export async function UserListPage({ role, toastKey }: { role: UserRole; toastKey?: string }) {
  const [currentAdmin, users, locale] = await Promise.all([
    requireRole("admin"),
    getUsersByRole(role),
    getPanelLocale(),
  ]);
  const dictionary = getPanelDictionary(locale);
  const config = getUserSectionConfig(role, locale);

  return (
    <PanelPage>
      {toastKey === "created" ? <ToastOnMount title={locale === "fa" ? "حساب کاربری ساخته شد." : "Account created."} /> : null}
      {toastKey === "updated" ? <ToastOnMount title={locale === "fa" ? "حساب کاربری به‌روز شد." : "Account updated."} /> : null}
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
        {users.length ? (
          <PanelTable
            columns={[
              { label: dictionary.users.name, className: "w-[28%]" },
              { label: dictionary.users.email, className: "w-[27%]" },
              { label: dictionary.users.accountStatus, className: "w-[13%]" },
              { label: dictionary.common.createdAt, className: "w-[17%]" },
              { label: dictionary.common.actions, className: "w-[15%]" },
            ]}
          >
            {users.map((user) => {
              const userName = getLocalizedUserName(user, locale);

              return <tr key={user.id}>
                <PanelTableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={userName} src={user.avatarUrl} className="size-10 shrink-0" />
                    <div className="min-w-0"><p className="truncate font-medium text-zinc-950 dark:text-zinc-50">{userName}</p>{user.id === currentAdmin.id ? <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">{dictionary.users.currentAccount}</p> : null}</div>
                  </div>
                </PanelTableCell>
                <PanelTableCell>
                  <span className="block truncate">
                    <bdi className="nums-en" dir="ltr">{user.email}</bdi>
                  </span>
                </PanelTableCell>
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
                  <div className="flex items-start gap-1">
                    <Link
                      href={`${config.path}/${user.id}/edit`}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    >
                      {dictionary.common.edit}
                    </Link>
                    <DeleteUserButton
                      role={role}
                      userId={user.id}
                      locale={locale}
                      disabled={user.id === currentAdmin.id}
                    />
                  </div>
                </PanelTableCell>
              </tr>;
            })}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={locale === "fa" ? `${config.singular}ی وجود ندارد` : `No ${config.plural.toLowerCase()} yet`}
            description={locale === "fa" ? `اولین حساب ${config.singular} را برای شروع این بخش بسازید.` : `Create the first ${config.singular.toLowerCase()} account to get started.`}
            action={
              <PanelPrimaryLink href={`${config.path}/new`}>
                {locale === "fa" ? `ساخت اولین ${config.singular}` : `Create first ${config.singular.toLowerCase()}`}
              </PanelPrimaryLink>
            }
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
