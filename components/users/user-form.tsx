"use client";

import { useActionState, useState } from "react";
import { permissionSections } from "@/lib/auth/permissions";
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
export type UserFormValues = { firstNameFa: string; lastNameFa: string; firstNameEn: string; lastNameEn: string; mobile: string; email: string; password: string; role: UserRole; isActive: boolean; avatarUrl: string; accessProfileId?: string };

export function UserForm({ role, locale, mode = "create", userId, accessProfiles = [], initialValues = { firstNameFa: "", lastNameFa: "", firstNameEn: "", lastNameEn: "", mobile: "", email: "", password: "", role, isActive: true, avatarUrl: "" } }: { role: UserRole; locale: Locale; mode?: "create" | "edit"; userId?: string; initialValues?: UserFormValues; accessProfiles?: Array<{ id: string; titleFa: string; titleEn: string; permissions: string[] }> }) {
  const config = getUserSectionConfig(role, locale);
  const dictionary = getPanelDictionary(locale);
  const formAction = mode === "edit" && userId ? updateManagedUser.bind(null, role, userId) : createManagedUser.bind(null, role);
  const [state, action, pending] = useActionState(formAction, initialState);
  useActionErrorToast(state);
  const { bind, values } = usePreservedFields({ firstNameFa: initialValues.firstNameFa, lastNameFa: initialValues.lastNameFa, firstNameEn: initialValues.firstNameEn, lastNameEn: initialValues.lastNameEn, mobile: initialValues.mobile, email: initialValues.email, password: initialValues.password, role: initialValues.role, accessProfileId: initialValues.accessProfileId ?? "" });
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
                  <PanelInput {...bind("firstNameEn")} autoComplete="given-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.firstNameEn} />
              </div>
              <div>
                <FormLabel label={dictionary.users.lastNameEn}>
                  <PanelInput {...bind("lastNameEn")} autoComplete="family-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.lastNameEn} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={isFa ? "اطلاعات ورود" : "Sign-in details"}
            description={isFa ? "شماره موبایل شناسه اصلی ورود است؛ ایمیل و رمز عبور اختیاری هستند." : "The mobile number is the primary sign-in identifier; email and password are optional."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FormLabel label={dictionary.users.mobile}>
                  <PanelInput {...bind("mobile")} type="tel" required autoComplete="tel-national" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.mobile} />
              </div>
              <div>
                <FormLabel label={dictionary.users.email}>
                  <PanelInput {...bind("email")} type="email" autoComplete="email" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.email} />
              </div>
              <div>
                <FormLabel
                  label={mode === "edit" ? dictionary.users.newPassword : dictionary.users.password}
                  hint={mode === "edit" ? (isFa ? "برای حفظ رمز فعلی، خالی بگذارید؛ در غیر این صورت حداقل ۸ نویسه استفاده کنید." : "Leave blank to keep the current password; otherwise use at least 8 characters.") : (isFa ? "اختیاری؛ در صورت استفاده حداقل ۸ نویسه." : "Optional; use at least 8 characters if set.")}
                >
                  <PanelInput {...bind("password")} type="password" minLength={8} autoComplete="new-password" dir="ltr" className="nums-en" />
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
            {values.role === "admin" ? <div className="mb-5">
              <FormLabel label={isFa ? "عنوان کاری و سطح دسترسی همکار" : "Colleague job title and permissions"} hint={isFa ? "مدیر کامل همه بخش‌ها را دارد؛ برای سایر همکاران یک عنوان محدود انتخاب کنید." : "Full administrators access every section. Choose a restricted profile for other colleagues."}>
                <PanelSelect {...bind("accessProfileId")}><option value="">{isFa ? "مدیر کامل — همه دسترسی‌ها" : "Full administrator — all permissions"}</option>{accessProfiles.map((profile) => <option key={profile.id} value={profile.id}>{isFa ? profile.titleFa : profile.titleEn}</option>)}</PanelSelect>
              </FormLabel>
              <FieldError errors={state.fieldErrors?.accessProfileId} />
              <p className="mt-2 text-xs leading-6 text-zinc-500">{values.accessProfileId ? (permissionSections.filter((section) => accessProfiles.find((profile) => profile.id === values.accessProfileId)?.permissions.includes(section.key)).map((section) => isFa ? section.fa : section.en).join(" · ") || (isFa ? "این عنوان دسترسی مدیریتی ندارد." : "This profile has no administrative permissions.")) : (isFa ? "دسترسی کامل، شامل مدیریت همکاران و عنوان‌های دسترسی." : "Full access, including colleague and permission management.")}</p>
              <Link href="/panel/admin/access" className="mt-2 inline-block cursor-pointer text-xs font-semibold text-emerald-700 dark:text-emerald-400">{isFa ? "تعریف و ویرایش عنوان‌های دسترسی" : "Manage access profiles"}</Link>
            </div> : null}
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
