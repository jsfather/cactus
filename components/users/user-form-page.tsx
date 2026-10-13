import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { accessProfiles } from "@/lib/db/schema";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { UserForm } from "@/components/users/user-form";
import type { UserRole } from "@/lib/db/schema";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserSectionConfig } from "@/lib/users/config";
import { getManagedUser } from "@/lib/users/queries";

export async function CreateUserPage({ role }: { role: UserRole }) {
  await requireRole("admin");
  const profiles = await getDatabase().select().from(accessProfiles);
  const locale = await getPanelLocale();
  const dictionary = getPanelDictionary(locale);
  const config = getUserSectionConfig(role, locale);

  return (
    <PanelPage>
      <div>
        <PanelBackLink href={config.path}>{dictionary.common.back} · {config.plural}</PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow={dictionary.users.eyebrow}
        title={locale === "fa" ? `${config.singular} جدید` : `New ${config.singular.toLowerCase()}`}
        description={locale === "fa" ? `اطلاعات ورود و وضعیت حساب ${config.singular} را تعیین کنید.` : `Set the sign-in details and account status for this ${config.singular.toLowerCase()}.`}
      />
      <UserForm role={role} locale={locale} accessProfiles={profiles} />
    </PanelPage>
  );
}

export async function EditUserPage({
  role,
  userId,
}: {
  role: UserRole;
  userId: string;
}) {
  await requireRole("admin");
  const profiles = await getDatabase().select().from(accessProfiles);
  const [locale, user] = await Promise.all([getPanelLocale(), getManagedUser(userId, role)]);
  const dictionary = getPanelDictionary(locale);
  const config = getUserSectionConfig(role, locale);

  if (!user) {
    notFound();
  }

  return (
    <PanelPage>
      <div>
        <PanelBackLink href={config.path}>{dictionary.common.back} · {config.plural}</PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow={dictionary.users.eyebrow}
        title={locale === "fa" ? `ویرایش ${config.singular}` : `Edit ${config.singular.toLowerCase()}`}
        description={locale === "fa" ? "نام، شماره موبایل، رمز عبور یا وضعیت دسترسی این حساب را تغییر دهید." : "Update this account's name, mobile, password, image, or access status."}
      />
      <UserForm
        accessProfiles={profiles}
        role={role}
        locale={locale}
        mode="edit"
        userId={user.id}
        initialValues={{
          firstNameFa: user.firstNameFa,
          lastNameFa: user.lastNameFa,
          firstNameEn: user.firstNameEn,
          lastNameEn: user.lastNameEn,
          mobile: user.mobile,
          email: user.email ?? "",
          password: "",
          role: user.role,
          accessProfileId: user.accessProfileId ?? "",
          isActive: user.isActive,
          avatarUrl: user.avatarUrl ?? "",
        }}
      />
    </PanelPage>
  );
}
