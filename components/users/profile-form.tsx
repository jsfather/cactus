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
  onboarding = false,
}: {
  locale: Locale;
  profile: { mobile: string; firstNameFa: string; lastNameFa: string; firstNameEn: string; lastNameEn: string; email: string | null; avatarUrl: string | null; bioFa: string | null; bioEn: string | null };
  onboarding?: boolean;
}) {
  const dictionary = getPanelDictionary(locale);
  const [state, action, pending] = useActionState(updateProfile, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({
    firstNameFa: profile.firstNameFa,
    lastNameFa: profile.lastNameFa,
    firstNameEn: profile.firstNameEn,
    lastNameEn: profile.lastNameEn,
    email: profile.email || "",
    password: "",
    confirmPassword: "",
    bioFa: profile.bioFa || "",
    bioEn: profile.bioEn || "",
  });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="onboarding" value={onboarding ? "1" : "0"} />
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
                  <PanelInput {...bind("firstNameEn")} autoComplete="given-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.firstNameEn} />
              </div>
              <div>
                <FormLabel label={dictionary.profile.lastNameEn}>
                  <PanelInput {...bind("lastNameEn")} autoComplete="family-name" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.lastNameEn} />
              </div>
              <div>
                <FormLabel label={dictionary.users.mobile}>
                  <PanelInput value={profile.mobile} readOnly disabled dir="ltr" className="nums-en" />
                </FormLabel>
              </div>
              <div>
                <FormLabel label={dictionary.users.email} hint={dictionary.profile.emailHint}>
                  <PanelInput {...bind("email")} type="email" autoComplete="email" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.email} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection title={locale === "fa" ? "رمز عبور" : "Password"} description={locale === "fa" ? "اختیاری است. با ساخت رمز عبور، بعداً می‌توانید بدون انتظار برای پیامک وارد شوید." : "Optional. Create one to sign in later without waiting for an SMS."}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FormLabel label={locale === "fa" ? "رمز عبور جدید" : "New password"} hint={locale === "fa" ? "حداقل ۸ نویسه" : "At least 8 characters"}>
                  <PanelInput {...bind("password")} type="password" minLength={8} autoComplete="new-password" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.password} />
              </div>
              <div>
                <FormLabel label={locale === "fa" ? "تکرار رمز عبور" : "Confirm password"}>
                  <PanelInput {...bind("confirmPassword")} type="password" minLength={8} autoComplete="new-password" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.confirmPassword} />
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

      <PanelFormFooter message={onboarding ? (locale === "fa" ? "نام و نام خانوادگی فارسی برای ادامه الزامی است." : "Your Persian first and last name are required to continue.") : dictionary.profile.saveHint} error={state.error}>
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button>
      </PanelFormFooter>
    </form>
  );
}
