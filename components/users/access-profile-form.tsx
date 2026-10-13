"use client";
import { useActionState, useState } from "react";
import { saveAccessProfile } from "@/lib/auth/access-actions";
import { permissionSections } from "@/lib/auth/permissions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast, ToastOnMount } from "@/components/feedback/toast-effects";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import { PanelFormSection, PanelFormFooter, primaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import type { ActionState } from "@/lib/workflows";

export function AccessProfileForm({ locale, profile }: { locale: Locale; profile?: { id: string; titleFa: string; titleEn: string; permissions: string[] } }) {
  const fa = locale === "fa";
  const [state, action, pending] = useActionState(saveAccessProfile.bind(null, profile?.id ?? null), {} as ActionState);
  const { bind } = usePreservedFields({ titleFa: profile?.titleFa ?? "", titleEn: profile?.titleEn ?? "" });
  const [permissions, setPermissions] = useState(profile?.permissions ?? []);
  useActionErrorToast(state);
  return <form action={action} className="space-y-5">
    <input type="hidden" name="locale" value={locale} />
    {state.success ? <ToastOnMount key={state.success} title={state.success} /> : null}
    <PanelFormSection title={fa ? "عنوان کاری و بخش‌های مجاز" : "Job title and allowed sections"} description={fa ? "بخش‌های تیک‌خورده قابل مشاهده و مدیریت هستند. بخش‌های بدون تیک از منو حذف و در سمت سرور مسدود می‌شوند. مدیریت همکاران و دسترسی‌ها فقط برای مدیر کامل است." : "Checked sections can be viewed and managed. Unchecked sections are hidden and blocked on the server. Account and permission management is reserved for full administrators."}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><FormLabel label={fa ? "عنوان فارسی" : "Persian title"}><PanelInput {...bind("titleFa")} dir="rtl" required /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
        <div><FormLabel label={fa ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} dir="ltr" required /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
      </div>
      <fieldset className="mt-5"><legend className="text-sm font-semibold">{fa ? "سطح دسترسی بخش‌ها" : "Section permissions"}</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{permissionSections.map((section) => <label key={section.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${permissions.includes(section.key) ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30" : "border-zinc-200 dark:border-zinc-800"}`}><input className="size-4 accent-emerald-700" type="checkbox" name="permissions" value={section.key} disabled={pending} checked={permissions.includes(section.key)} onChange={(event) => setPermissions((current) => event.target.checked ? [...current, section.key] : current.filter((item) => item !== section.key))} /><span>{fa ? section.fa : section.en}</span></label>)}</div><FieldError errors={state.fieldErrors?.permissions} /></fieldset>
    </PanelFormSection>
    <PanelFormFooter error={state.error}><button className={primaryButtonClass} disabled={pending}>{pending ? (fa ? "در حال ذخیره…" : "Saving…") : (fa ? "ذخیره عنوان و دسترسی‌ها" : "Save title and permissions")}</button></PanelFormFooter>
  </form>;
}
