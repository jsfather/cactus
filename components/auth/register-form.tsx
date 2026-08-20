"use client";

import { useActionState } from "react";
import { register, type RegisterState } from "@/app/(auth)/register/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import { getAuthDictionary } from "@/lib/i18n/auth";
import type { Locale } from "@/lib/i18n/config";

const initialState: RegisterState = {};

export function RegisterForm({ locale }: { locale: Locale }) {
  const dictionary = getAuthDictionary(locale);
  const [state, action, pending] = useActionState(register, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({ firstNameFa: "", lastNameFa: "", firstNameEn: "", lastNameEn: "", email: "", password: "", confirmPassword: "" });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FormLabel label={dictionary.firstNameFa}><PanelInput {...bind("firstNameFa")} required autoComplete="given-name" dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.firstNameFa} /></div>
        <div><FormLabel label={dictionary.lastNameFa}><PanelInput {...bind("lastNameFa")} required autoComplete="family-name" dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.lastNameFa} /></div>
        <div><FormLabel label={dictionary.firstNameEn}><PanelInput {...bind("firstNameEn")} required autoComplete="given-name" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.firstNameEn} /></div>
        <div><FormLabel label={dictionary.lastNameEn}><PanelInput {...bind("lastNameEn")} required autoComplete="family-name" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.lastNameEn} /></div>
      </div>
      <div><FormLabel label={dictionary.email}><PanelInput {...bind("email")} type="email" required autoComplete="email" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.email} /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FormLabel label={dictionary.password} hint={locale === "fa" ? "حداقل ۱۲ نویسه" : "At least 12 characters"}><PanelInput {...bind("password")} type="password" required minLength={12} autoComplete="new-password" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.password} /></div>
        <div><FormLabel label={dictionary.confirmPassword}><PanelInput {...bind("confirmPassword")} type="password" required minLength={12} autoComplete="new-password" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.confirmPassword} /></div>
      </div>
      {state.error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="w-full cursor-pointer rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400">
        {pending ? dictionary.registerSubmitting : dictionary.registerSubmit}
      </button>
    </form>
  );
}
