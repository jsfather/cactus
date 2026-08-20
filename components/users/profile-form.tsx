"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/app/(panel)/panel/profile/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import { PanelFormSection, primaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: ProfileFormState = {};

export function ProfileForm({
  locale,
  profile,
}: {
  locale: Locale;
  profile: { name: string; email: string; avatarUrl: string | null; bioFa: string | null; bioEn: string | null };
}) {
  const dictionary = getPanelDictionary(locale);
  const [state, action, pending] = useActionState(updateProfile, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({
    name: profile.name,
    bioFa: profile.bioFa || "",
    bioEn: profile.bioEn || "",
  });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <PanelFormSection title={dictionary.profile.personalInfo}>
        <div className="space-y-6">
          <ImageUploadField name="avatarUrl" kind="avatar" locale={locale} initialValue={profile.avatarUrl || ""} label={dictionary.profile.avatar} aspect="square" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FormLabel label={dictionary.profile.name}>
                <PanelInput {...bind("name")} required autoComplete="name" />
              </FormLabel>
              <FieldError errors={state.fieldErrors?.name} />
            </div>
            <div dir="ltr">
              <FormLabel label={dictionary.users.email} hint={dictionary.profile.emailHint}>
                <PanelInput value={profile.email} disabled className="nums-en text-start" />
              </FormLabel>
            </div>
            <div>
              <FormLabel label={dictionary.profile.bioFa}>
                <textarea {...bind("bioFa")} rows={5} dir="rtl" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950" />
              </FormLabel>
              <FieldError errors={state.fieldErrors?.bioFa} />
            </div>
            <div dir="ltr">
              <FormLabel label={dictionary.profile.bioEn}>
                <textarea {...bind("bioEn")} rows={5} className="nums-en w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950" />
              </FormLabel>
              <FieldError errors={state.fieldErrors?.bioEn} />
            </div>
          </div>
        </div>
      </PanelFormSection>

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        {state.error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : <span />}
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button>
      </div>
    </form>
  );
}
