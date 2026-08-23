"use client";

import { useActionState, useState } from "react";
import {
  loginWithPassword,
  requestAuthenticationOtp,
  verifyAuthenticationOtp,
  type MobileAuthState,
} from "@/app/(auth)/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import { getAuthDictionary } from "@/lib/i18n/auth";
import type { Locale } from "@/lib/i18n/config";

const initialState: MobileAuthState = {};
const submitClass = "w-full cursor-pointer rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400";
const textButtonClass = "cursor-pointer text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300";

export function MobileAuthForm({ locale }: { locale: Locale }) {
  const dictionary = getAuthDictionary(locale);
  const [requestState, requestAction, requesting] = useActionState(requestAuthenticationOtp, initialState);
  const [verifyState, verifyAction, verifying] = useActionState(verifyAuthenticationOtp, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(loginWithPassword, initialState);
  const [editingMobile, setEditingMobile] = useState(false);
  const [usePassword, setUsePassword] = useState(false);

  useActionErrorToast(requestState);
  useActionErrorToast(verifyState);
  useActionErrorToast(passwordState);

  const mobile = requestState.mobile ?? verifyState.mobile ?? passwordState.mobile ?? "";
  const showVerification = requestState.step === "verify" && !editingMobile;
  const error = usePassword ? passwordState.error : verifyState.error ?? requestState.error;

  if (!showVerification) {
    return (
      <form action={requestAction} className="space-y-5" onSubmit={() => setEditingMobile(false)}>
        <input type="hidden" name="locale" value={locale} />
        <div>
          <FormLabel label={dictionary.mobile} hint={dictionary.mobileHint}>
            <PanelInput
              name="mobile"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              defaultValue={mobile}
              dir="ltr"
              className="nums-en"
              placeholder="09•• ••• ••••"
            />
          </FormLabel>
          <FieldError errors={requestState.fieldErrors?.mobile} />
        </div>
        {requestState.error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{requestState.error}</p> : null}
        <button type="submit" disabled={requesting} className={submitClass}>
          {requesting ? dictionary.requestingCode : dictionary.requestCode}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
        {dictionary.codeSent.replace("{mobile}", mobile)}
      </p>
      {requestState.developmentCode ? (
        <p className="nums-en rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
          {dictionary.developmentCode}: <strong className="text-lg tracking-[0.2em]">{requestState.developmentCode}</strong>
        </p>
      ) : null}

      {usePassword && requestState.purpose === "login" ? (
        <form action={passwordAction} className="space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="mobile" value={mobile} />
          <FormLabel label={dictionary.password}>
            <PanelInput name="password" type="password" required autoComplete="current-password" dir="ltr" className="nums-en" autoFocus />
          </FormLabel>
          {error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <button type="submit" disabled={passwordPending} className={submitClass}>
            {passwordPending ? dictionary.verifyingCode : dictionary.passwordSubmit}
          </button>
        </form>
      ) : (
        <form action={verifyAction} className="space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="mobile" value={mobile} />
          <input type="hidden" name="purpose" value={requestState.purpose} />
          <FormLabel label={dictionary.code}>
            <PanelInput
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              minLength={6}
              maxLength={6}
              pattern="[0-9۰-۹٠-٩]{6}"
              dir="ltr"
              className="nums-en text-center text-xl tracking-[0.35em]"
              autoFocus
            />
          </FormLabel>
          {error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <button type="submit" disabled={verifying} className={submitClass}>
            {verifying ? dictionary.verifyingCode : dictionary.verifyCode}
          </button>
        </form>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className={textButtonClass} onClick={() => setEditingMobile(true)}>{dictionary.editMobile}</button>
        {requestState.purpose === "login" && requestState.hasPassword ? (
          <button type="button" className={textButtonClass} onClick={() => setUsePassword((value) => !value)}>
            {usePassword ? dictionary.useOtp : dictionary.usePassword}
          </button>
        ) : null}
      </div>

      {!usePassword ? (
        <form action={requestAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="mobile" value={mobile} />
          <button type="submit" disabled={requesting} className={`${textButtonClass} w-full rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700`}>
            {requesting ? dictionary.requestingCode : dictionary.resendCode}
          </button>
        </form>
      ) : null}
    </div>
  );
}
