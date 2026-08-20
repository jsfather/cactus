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
  profile: { firstNameFa: string; lastNameFa: string; firstNameEn: string; lastNameEn: string; email: string; avatarUrl: string | null; bioFa: string | null; bioEn: string | null };
}) {
  const dictionary = getPanelDictionary(locale);
  const [state, action, pending] = useActionState(updateProfile, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({
    firstNameFa: profile.firstNameFa,
    lastNameFa: profile.lastNameFa,
    firstNameEn: profile.firstNameEn,
    lastNameEn: profile.lastNameEn,
    email: profile.email,
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
                <FormLabel label={dictionary.profile.firstNameFa}>
                  <PanelInput {...bind("firstNameFa")} required autoComplete="given-name" dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.firstNameFa} />
              </div>
              <div>
                <FormLabel label={dictionary.profile.lastNameFa}>
                  <PanelInput {...bind("lastNameFa")} required autoComplete="family-name" dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.lastNameFa} />
              </div>
              <div>
                <FormLabel label={dictionary.profile.firstNameEn}>
                  <PanelInput {...bind("firstNameEn")} required autoComplete="given-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.firstNameEn} />
              </div>
              <div>
                <FormLabel label={dictionary.profile.lastNameEn}>
                  <PanelInput {...bind("lastNameEn")} required autoComplete="family-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.lastNameEn} />
              </div>
              <div className="sm:col-span-2">
                <FormLabel label={dictionary.users.email} hint={dictionary.profile.emailHint}>
                  <PanelInput {...bind("email")} type="email" required autoComplete="email" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.email} />
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
