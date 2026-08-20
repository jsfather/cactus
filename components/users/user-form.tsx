"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createManagedUser, type UserFormState, updateManagedUser } from "@/app/(panel)/panel/admin/users/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getUserSectionConfig } from "@/lib/users/config";

const initialState: UserFormState = {};
export type UserFormValues = { firstNameFa: string; lastNameFa: string; firstNameEn: string; lastNameEn: string; email: string; password: string; role: UserRole; isActive: boolean; avatarUrl: string };

export function UserForm({ role, locale, mode = "create", userId, initialValues = { firstNameFa: "", lastNameFa: "", firstNameEn: "", lastNameEn: "", email: "", password: "", role, isActive: true, avatarUrl: "" } }: { role: UserRole; locale: Locale; mode?: "create" | "edit"; userId?: string; initialValues?: UserFormValues }) {
  const config = getUserSectionConfig(role, locale);
  const dictionary = getPanelDictionary(locale);
  const formAction = mode === "edit" && userId ? updateManagedUser.bind(null, role, userId) : createManagedUser.bind(null, role);
  const [state, action, pending] = useActionState(formAction, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({ firstNameFa: initialValues.firstNameFa, lastNameFa: initialValues.lastNameFa, firstNameEn: initialValues.firstNameEn, lastNameEn: initialValues.lastNameEn, email: initialValues.email, password: initialValues.password, role: initialValues.role });
  const [isActive, setIsActive] = useState(initialValues.isActive);
  const isFa = locale === "fa";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection
            title={dictionary.profile.personalInfo}
            description={isFa ? `نام‌های نمایشی ${config.singular} را برای هر دو زبان وارد کنید.` : `Enter this ${config.singular.toLowerCase()}'s display name in both languages.`}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FormLabel label={dictionary.users.firstNameFa}>
                  <PanelInput {...bind("firstNameFa")} required autoComplete="given-name" dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.firstNameFa} />
              </div>
              <div>
                <FormLabel label={dictionary.users.lastNameFa}>
                  <PanelInput {...bind("lastNameFa")} required autoComplete="family-name" dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.lastNameFa} />
              </div>
              <div>
                <FormLabel label={dictionary.users.firstNameEn}>
                  <PanelInput {...bind("firstNameEn")} required autoComplete="given-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.firstNameEn} />
              </div>
              <div>
                <FormLabel label={dictionary.users.lastNameEn}>
                  <PanelInput {...bind("lastNameEn")} required autoComplete="family-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.lastNameEn} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={isFa ? "اطلاعات ورود" : "Sign-in details"}
            description={isFa ? "ایمیل و رمز عبور برای ورود به پنل استفاده می‌شوند." : "The email address and password are used to sign in to the panel."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FormLabel label={dictionary.users.email}>
                  <PanelInput {...bind("email")} type="email" required autoComplete="email" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.email} />
              </div>
              <div>
                <FormLabel
                  label={mode === "edit" ? dictionary.users.newPassword : dictionary.users.password}
                  hint={mode === "edit" ? (isFa ? "برای حفظ رمز فعلی، خالی بگذارید." : "Leave blank to keep the current password.") : (isFa ? "حداقل ۱۲ نویسه استفاده کنید." : "Use at least 12 characters.")}
                >
                  <PanelInput {...bind("password")} type="password" required={mode === "create"} minLength={mode === "create" ? 12 : undefined} autoComplete="new-password" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.password} />
              </div>
            </div>
          </PanelFormSection>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <PanelFormSection title={dictionary.users.avatar} description={dictionary.profile.avatarDescription}>
            <ImageUploadField name="avatarUrl" kind="avatar" locale={locale} initialValue={initialValues.avatarUrl} label={dictionary.users.avatar} aspect="square" />
          </PanelFormSection>

          <PanelFormSection
            title={isFa ? "دسترسی حساب" : "Account access"}
            description={isFa ? "نقش و وضعیت فعال بودن، سطح دسترسی این حساب را تعیین می‌کنند." : "Role and active status determine this account's access."}
          >
            <div className="space-y-4">
              <div>
                <FormLabel label={dictionary.users.role}>
                  <PanelSelect {...bind("role")} required>
                    {(["admin", "teacher", "student", "member"] as const).map((optionRole) => (
                      <option key={optionRole} value={optionRole}>{getUserSectionConfig(optionRole, locale).singular}</option>
                    ))}
                  </PanelSelect>
                </FormLabel>
                <FieldError errors={state.fieldErrors?.role} />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-start transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-800">
              <input type="checkbox" name="isActive" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-emerald-700" />
              <span>
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{dictionary.users.activeAccount}</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">{dictionary.users.activeHint}</span>
              </span>
              </label>
            </div>
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter message={config.description} error={state.error}>
        <Link href={config.path} className={secondaryButtonClass}>{dictionary.common.cancel}</Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : mode === "edit" ? dictionary.common.save : `${dictionary.common.new} ${config.singular}`}</button>
      </PanelFormFooter>
    </form>
  );
}
