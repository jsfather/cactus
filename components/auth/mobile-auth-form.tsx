"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { loginWithPassword, requestAuthenticationOtp, verifyAuthenticationOtp, type MobileAuthState } from "@/app/(auth)/actions";
import { OtpCodeInput } from "@/components/auth/otp-code-input";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { FormLabel, PanelInput } from "@/components/panel/form-controls";
import { getAuthDictionary } from "@/lib/i18n/auth";
import type { Locale } from "@/lib/i18n/config";

const initialState: MobileAuthState = {};
const submitClass = "group flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:shadow-black/20 dark:hover:bg-emerald-400";
const textButtonClass = "cursor-pointer rounded-lg px-1 py-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200";

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 10h12m0 0-4-4m4 4-4 4" /></svg>;
}

function Spinner() {
  return <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

export function MobileAuthForm({ locale }: { locale: Locale }) {
  const dictionary = getAuthDictionary(locale);
  const isFa = locale === "fa";
  const [requestState, requestAction, requesting] = useActionState(requestAuthenticationOtp, initialState);
  const [verifyState, verifyAction, verifying] = useActionState(verifyAuthenticationOtp, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(loginWithPassword, initialState);
  const [editingAttemptId, setEditingAttemptId] = useState<string | null>(null);
  const [usePassword, setUsePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const verifyFormRef = useRef<HTMLFormElement>(null);
  const lastAutoSubmittedCode = useRef("");

  useActionErrorToast(requestState);
  useActionErrorToast(verifyState);
  useActionErrorToast(passwordState);

  const mobile = requestState.mobile ?? verifyState.mobile ?? passwordState.mobile ?? "";
  const showVerification = requestState.step === "verify" && requestState.attemptId !== editingAttemptId;
  const error = usePassword ? passwordState.error : verifyState.error ?? requestState.error;
  const updateOtpCode = useCallback((value: string) => {
    setOtpCode(value);
    if (value.length < 6) lastAutoSubmittedCode.current = "";
  }, []);
  const submitCompletedOtp = useCallback((value: string) => {
    if (lastAutoSubmittedCode.current === value) return;
    lastAutoSubmittedCode.current = value;
    window.requestAnimationFrame(() => verifyFormRef.current?.requestSubmit());
  }, []);

  if (!showVerification) {
    return (
      <form action={requestAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-1 shadow-inner shadow-zinc-950/[0.02] transition focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-600/10 dark:border-zinc-800 dark:bg-zinc-950/70 dark:focus-within:border-emerald-600">
            <label htmlFor="auth-mobile" className="block px-3 pt-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{dictionary.mobile}</label>
            <div className="flex items-center gap-2">
              <span className="grid size-10 shrink-0 place-items-center text-zinc-400 dark:text-zinc-500"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path strokeLinecap="round" d="M10 5h4M11 18.5h2" /></svg></span>
              <input id="auth-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel-national" required defaultValue={mobile} dir="ltr" className="auth-mobile-input nums-en min-h-11 w-full border-0 bg-transparent px-2 text-lg font-semibold tracking-wide text-zinc-950 outline-none ring-0 placeholder:text-zinc-300 focus:outline-none focus:ring-0 dark:text-zinc-50 dark:placeholder:text-zinc-700" placeholder="0912 123 4567" autoFocus />
            </div>
          </div>
          {requestState.fieldErrors?.mobile?.[0] ? <p className="mt-2 text-xs text-red-600 dark:text-red-400">{requestState.fieldErrors.mobile[0]}</p> : null}
        </div>
        <p className="flex items-start gap-2 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5 16 5v4.5c0 3.7-2.5 6.4-6 8-3.5-1.6-6-4.3-6-8V5l6-2.5Z" /><path strokeLinecap="round" d="m7.5 10 1.6 1.6 3.5-3.7" /></svg>
          {isFa ? "ورود و ثبت‌نام یکپارچه است؛ نوع حساب را سامانه به‌صورت خودکار تشخیص می‌دهد." : "Sign-in and registration are unified; the system detects your account automatically."}
        </p>
        {requestState.error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{requestState.error}</p> : null}
        <button type="submit" disabled={requesting} className={submitClass}>{requesting ? <><Spinner />{dictionary.requestingCode}</> : <>{dictionary.requestCode}<ArrowIcon /></>}</button>
      </form>
    );
  }

  return (
    <div data-auth-step="verify" className="space-y-3">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-900 dark:bg-emerald-950/35">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white dark:bg-emerald-500 dark:text-emerald-950"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" /></svg></span>
          <div className="min-w-0"><p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{isFa ? "کد به این شماره ارسال شد" : "Code sent to"}</p><bdi className="nums-en mt-0.5 block text-base font-bold text-emerald-950 dark:text-emerald-100" dir="ltr">{mobile}</bdi></div>
          <button type="button" className={`${textButtonClass} ms-auto shrink-0`} onClick={() => { setEditingAttemptId(requestState.attemptId ?? null); setUsePassword(false); }}>{dictionary.editMobile}</button>
        </div>
      </div>

      {requestState.developmentCode ? <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-amber-950 dark:border-amber-800 dark:bg-amber-950/45 dark:text-amber-100"><p className="text-xs font-medium">{dictionary.developmentCode}</p><strong className="nums-en text-lg tracking-[0.24em]" dir="ltr">{requestState.developmentCode}</strong></div> : null}

      {usePassword && requestState.purpose === "login" ? (
        <form action={passwordAction} className="space-y-3">
          <input type="hidden" name="locale" value={locale} /><input type="hidden" name="mobile" value={mobile} />
          <FormLabel label={dictionary.password}><span className="relative block"><PanelInput name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" dir="ltr" className="nums-en pe-14" autoFocus /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? (isFa ? "پنهان کردن رمز عبور" : "Hide password") : (isFa ? "نمایش رمز عبور" : "Show password")} className="absolute end-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"><svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 10s2.7-4.5 7.5-4.5 7.5 4.5 7.5 4.5-2.7 4.5-7.5 4.5S2.5 10 2.5 10Z" /><circle cx="10" cy="10" r="2.2" />{showPassword ? null : <path d="m3 3 14 14" />}</svg></button></span></FormLabel>
          {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p> : null}
          <button type="submit" disabled={passwordPending} className={submitClass}>{passwordPending ? <><Spinner />{dictionary.verifyingCode}</> : <>{dictionary.passwordSubmit}<ArrowIcon /></>}</button>
        </form>
      ) : (
        <form ref={verifyFormRef} action={verifyAction} className="space-y-3">
          <input type="hidden" name="locale" value={locale} /><input type="hidden" name="mobile" value={mobile} /><input type="hidden" name="purpose" value={requestState.purpose} />
          <OtpCodeInput key={requestState.attemptId} locale={locale} error={error} onValueChange={updateOtpCode} onComplete={submitCompletedOtp} />
          <button type="submit" disabled={verifying || otpCode.length !== 6} className={submitClass}>{verifying ? <><Spinner />{dictionary.verifyingCode}</> : <>{dictionary.verifyCode}<ArrowIcon /></>}</button>
        </form>
      )}

      {requestState.purpose === "login" && requestState.hasPassword ? <div className="relative flex items-center"><span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" /><span className="px-3 text-xs text-zinc-400">{isFa ? "یا" : "or"}</span><span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" /></div> : null}
      {requestState.purpose === "login" && requestState.hasPassword ? <button type="button" className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300" onClick={() => setUsePassword((value) => !value)}><svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="8" width="12" height="9" rx="2" /><path strokeLinecap="round" d="M6.5 8V6.5a3.5 3.5 0 0 1 7 0V8" /></svg>{usePassword ? dictionary.useOtp : dictionary.usePassword}</button> : null}

      {!usePassword ? <ResendControl key={requestState.attemptId} locale={locale} mobile={mobile} requesting={requesting} action={requestAction} /> : null}
    </div>
  );
}

function ResendControl({ locale, mobile, requesting, action }: { locale: Locale; mobile: string; requesting: boolean; action: (payload: FormData) => void }) {
  const dictionary = getAuthDictionary(locale);
  const isFa = locale === "fa";
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <form action={action} className="text-center"><input type="hidden" name="locale" value={locale} /><input type="hidden" name="mobile" value={mobile} /><p className="text-xs text-zinc-500 dark:text-zinc-400">{isFa ? "کد را دریافت نکردید؟" : "Didn't receive the code?"}</p><button type="submit" disabled={requesting || seconds > 0} className={`${textButtonClass} mt-1 disabled:cursor-not-allowed disabled:text-zinc-400`}>{requesting ? dictionary.requestingCode : seconds > 0 ? `${dictionary.resendCode} (${new Intl.NumberFormat(isFa ? "fa-IR" : "en-US").format(seconds)})` : dictionary.resendCode}</button></form>;
}
