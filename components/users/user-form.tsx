"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createManagedUser, type UserFormState, updateManagedUser } from "@/app/(panel)/panel/admin/users/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import { PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getUserSectionConfig } from "@/lib/users/config";

const initialState: UserFormState = {};
export type UserFormValues = { name: string; email: string; password: string; isActive: boolean; avatarUrl: string };

export function UserForm({ role, locale, mode = "create", userId, initialValues = { name: "", email: "", password: "", isActive: true, avatarUrl: "" } }: { role: UserRole; locale: Locale; mode?: "create" | "edit"; userId?: string; initialValues?: UserFormValues }) {
  const config = getUserSectionConfig(role, locale);
  const dictionary = getPanelDictionary(locale);
  const formAction = mode === "edit" && userId ? updateManagedUser.bind(null, role, userId) : createManagedUser.bind(null, role);
  const [state, action, pending] = useActionState(formAction, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({ name: initialValues.name, email: initialValues.email, password: initialValues.password });
  const [isActive, setIsActive] = useState(initialValues.isActive);
  const isFa = locale === "fa";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <PanelFormSection title={`${config.singular} · ${dictionary.profile.personalInfo}`}>
        <div className="space-y-6">
          <ImageUploadField name="avatarUrl" kind="avatar" locale={locale} initialValue={initialValues.avatarUrl} label={dictionary.users.avatar} aspect="square" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div><FormLabel label={dictionary.users.fullName}><PanelInput {...bind("name")} required autoComplete="name" /></FormLabel><FieldError errors={state.fieldErrors?.name} /></div>
            <div dir="ltr"><FormLabel label={dictionary.users.email}><PanelInput {...bind("email")} type="email" required autoComplete="email" className="nums-en text-start" /></FormLabel><FieldError errors={state.fieldErrors?.email} /></div>
            <div className="sm:col-span-2" dir="ltr"><FormLabel label={mode === "edit" ? dictionary.users.newPassword : dictionary.users.password} hint={mode === "edit" ? (isFa ? "برای حفظ رمز فعلی، این قسمت را خالی بگذارید. رمز جدید حداقل ۱۲ نویسه باشد." : "Leave blank to keep the current password. New passwords need at least 12 characters.") : (isFa ? "حداقل ۱۲ نویسه استفاده کنید." : "Use at least 12 characters.")}><PanelInput {...bind("password")} type="password" required={mode === "create"} minLength={mode === "create" ? 12 : undefined} autoComplete="new-password" className="nums-en text-start" /></FormLabel><FieldError errors={state.fieldErrors?.password} /></div>
            <label className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 sm:col-span-2 dark:border-zinc-800"><input type="checkbox" name="isActive" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="mt-1 size-4 accent-emerald-700" /><span><span className="block text-sm font-medium">{dictionary.users.activeAccount}</span><span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">{dictionary.users.activeHint}</span></span></label>
          </div>
        </div>
      </PanelFormSection>
      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        {state.error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : <p className="text-sm text-zinc-500 dark:text-zinc-400">{config.description}</p>}
        <div className="flex flex-wrap gap-3"><Link href={config.path} className={secondaryButtonClass}>{dictionary.common.cancel}</Link><button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : mode === "edit" ? dictionary.common.save : `${dictionary.common.new} ${config.singular}`}</button></div>
      </section>
    </form>
  );
}
