import { notFound } from "next/navigation";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { UserForm } from "@/components/users/user-form";
import type { UserRole } from "@/lib/db/schema";
import { userSectionConfig } from "@/lib/users/config";
import { getManagedUser } from "@/lib/users/queries";

export function CreateUserPage({ role }: { role: UserRole }) {
  const config = userSectionConfig[role];

  return (
    <PanelPage>
      <div>
        <PanelBackLink href={config.path}>بازگشت به {config.plural}</PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow="مدیریت کاربران"
        title={`${config.singular} جدید`}
        description={`اطلاعات ورود و وضعیت حساب ${config.singular} را تعیین کنید.`}
      />
      <UserForm role={role} />
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
  const config = userSectionConfig[role];
  const user = await getManagedUser(userId, role);

  if (!user) {
    notFound();
  }

  return (
    <PanelPage>
      <div>
        <PanelBackLink href={config.path}>بازگشت به {config.plural}</PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow="مدیریت کاربران"
        title={`ویرایش ${config.singular}`}
        description="نام، ایمیل، رمز عبور یا وضعیت دسترسی این حساب را تغییر دهید."
      />
      <UserForm
        role={role}
        mode="edit"
        userId={user.id}
        initialValues={{
          name: user.name,
          email: user.email,
          password: "",
          isActive: user.isActive,
        }}
      />
    </PanelPage>
  );
}
