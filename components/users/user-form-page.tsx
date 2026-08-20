import { notFound } from "next/navigation";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { UserForm } from "@/components/users/user-form";
import type { UserRole } from "@/lib/db/schema";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getUserSectionConfig } from "@/lib/users/config";
import { getManagedUser } from "@/lib/users/queries";

export async function CreateUserPage({ role }: { role: UserRole }) {
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
      <UserForm role={role} locale={locale} />
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
        description={locale === "fa" ? "نام، ایمیل، رمز عبور یا وضعیت دسترسی این حساب را تغییر دهید." : "Update this account's name, email, password, image, or access status."}
      />
      <UserForm
        role={role}
        locale={locale}
        mode="edit"
        userId={user.id}
        initialValues={{
          firstNameFa: user.firstNameFa,
          lastNameFa: user.lastNameFa,
          firstNameEn: user.firstNameEn,
          lastNameEn: user.lastNameEn,
          email: user.email,
          password: "",
          role: user.role,
          isActive: user.isActive,
          avatarUrl: user.avatarUrl ?? "",
        }}
      />
    </PanelPage>
  );
}
