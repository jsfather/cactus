import Link from "next/link";
import { DeleteUserButton } from "@/components/users/delete-user-button";
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
import { userSectionConfig } from "@/lib/users/config";
import { getUsersByRole } from "@/lib/users/queries";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date);
}

export async function UserListPage({ role }: { role: UserRole }) {
  const [currentAdmin, users] = await Promise.all([
    requireRole("admin"),
    getUsersByRole(role),
  ]);
  const config = userSectionConfig[role];

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow="مدیریت کاربران"
        title={config.plural}
        description={config.description}
        actions={
          <PanelPrimaryLink href={`${config.path}/new`}>
            {config.singular} جدید
          </PanelPrimaryLink>
        }
      />

      <PanelSurface>
        {users.length ? (
          <PanelTable
            columns={[
              { label: "نام", className: "w-[24%]" },
              { label: "ایمیل", className: "w-[28%]" },
              { label: "وضعیت", className: "w-[14%]" },
              { label: "تاریخ ساخت", className: "w-[18%]" },
              { label: "عملیات", className: "w-[16%]" },
            ]}
          >
            {users.map((user) => (
              <tr key={user.id}>
                <PanelTableCell>
                  <p className="font-medium text-zinc-950 dark:text-zinc-50">
                    {user.name}
                  </p>
                  {user.id === currentAdmin.id ? (
                    <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                      حساب فعلی شما
                    </p>
                  ) : null}
                </PanelTableCell>
                <PanelTableCell>
                  <span className="nums-en block truncate text-end" dir="ltr">
                    {user.email}
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
                    {user.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </PanelTableCell>
                <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                  {formatDate(user.createdAt)}
                </PanelTableCell>
                <PanelTableCell>
                  <div className="flex items-start gap-1">
                    <Link
                      href={`${config.path}/${user.id}/edit`}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    >
                      ویرایش
                    </Link>
                    <DeleteUserButton
                      role={role}
                      userId={user.id}
                      disabled={user.id === currentAdmin.id}
                    />
                  </div>
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={`${config.singular}ی وجود ندارد`}
            description={`اولین حساب ${config.singular} را برای شروع این بخش بسازید.`}
            action={
              <PanelPrimaryLink href={`${config.path}/new`}>
                ساخت اولین {config.singular}
              </PanelPrimaryLink>
            }
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
