"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/app/(panel)/panel/profile/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass } from "@/components/panel/ui";
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
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection title={dictionary.profile.personalInfo} description={dictionary.profile.namesDescription}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FormLabel label={dictionary.profile.nameFa}>
                  <PanelInput {...bind("nameFa")} required autoComplete="name" dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.nameFa} />
              </div>
              <div>
                <FormLabel label={dictionary.profile.nameEn}>
                  <PanelInput {...bind("nameEn")} required autoComplete="name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.nameEn} />
              </div>
              <div className="sm:col-span-2">
                <FormLabel label={dictionary.users.email} hint={dictionary.profile.emailHint}>
                  <PanelInput value={profile.email} disabled dir="ltr" className="nums-en" />
                </FormLabel>
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection title={locale === "fa" ? "درباره من" : "About me"} description={dictionary.profile.bioDescription}>
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <FormLabel label={dictionary.profile.bioFa}>
                  <PanelTextarea {...bind("bioFa")} rows={8} dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.bioFa} />
              </div>
              <div>
                <FormLabel label={dictionary.profile.bioEn}>
                  <PanelTextarea {...bind("bioEn")} rows={8} dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.bioEn} />
              </div>
            </div>
          </PanelFormSection>
        </div>

        <aside className="xl:sticky xl:top-6">
          <PanelFormSection title={dictionary.profile.avatar} description={dictionary.profile.avatarDescription}>
            <ImageUploadField name="avatarUrl" kind="avatar" locale={locale} initialValue={profile.avatarUrl || ""} label={dictionary.profile.imageFile} aspect="square" />
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter message={dictionary.profile.saveHint} error={state.error}>
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button>
      </PanelFormFooter>
    </form>
  );
}
