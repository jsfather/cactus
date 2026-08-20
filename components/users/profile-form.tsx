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
  profile: { nameFa: string; nameEn: string; email: string; avatarUrl: string | null; bioFa: string | null; bioEn: string | null };
}) {
  const dictionary = getPanelDictionary(locale);
  const [state, action, pending] = useActionState(updateProfile, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({
    nameFa: profile.nameFa,
    nameEn: profile.nameEn,
    bioFa: profile.bioFa || "",
    bioEn: profile.bioEn || "",
  });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <PanelFormSection title={dictionary.profile.personalInfo} description={dictionary.profile.namesDescription}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div dir="rtl">
              <FormLabel label={dictionary.profile.nameFa}>
                <PanelInput {...bind("nameFa")} required autoComplete="name" className="text-start" />
              </FormLabel>
              <FieldError errors={state.fieldErrors?.nameFa} />
            </div>
            <div dir="ltr">
              <FormLabel label={dictionary.profile.nameEn}>
                <PanelInput {...bind("nameEn")} required autoComplete="name" className="nums-en text-start" />
              </FormLabel>
              <FieldError errors={state.fieldErrors?.nameEn} />
            </div>
            <div dir="ltr" className="sm:col-span-2">
              <FormLabel label={dictionary.users.email} hint={dictionary.profile.emailHint}>
                <PanelInput value={profile.email} disabled className="nums-en text-start" />
              </FormLabel>
            </div>
          </div>
        </PanelFormSection>

        <PanelFormSection title={dictionary.profile.avatar} description={dictionary.profile.avatarDescription}>
          <ImageUploadField name="avatarUrl" kind="avatar" locale={locale} initialValue={profile.avatarUrl || ""} label={dictionary.profile.imageFile} aspect="square" />
        </PanelFormSection>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <PanelFormSection title={dictionary.profile.bioFa} description={dictionary.profile.bioDescription}>
          <div dir="rtl">
            <textarea {...bind("bioFa")} rows={7} dir="rtl" className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950" />
            <FieldError errors={state.fieldErrors?.bioFa} />
          </div>
        </PanelFormSection>

        <PanelFormSection title={dictionary.profile.bioEn} description={dictionary.profile.bioDescription}>
          <div dir="ltr">
            <textarea {...bind("bioEn")} rows={7} className="nums-en w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950" />
            <FieldError errors={state.fieldErrors?.bioEn} />
          </div>
        </PanelFormSection>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-zinc-800 dark:bg-zinc-950">
        {state.error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : <p className="max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">{dictionary.profile.saveHint}</p>}
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button>
      </div>
    </form>
  );
}
