"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/(auth)/login/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { getAuthDictionary } from "@/lib/i18n/auth";
import type { Locale } from "@/lib/i18n/config";

const initialState: LoginState = {};

export function LoginForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(login, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({ email: "", password: "" });
  const dictionary = getAuthDictionary(locale);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          {dictionary.email}
        </label>
        <input
          {...bind("email")}
          id="email"
          type="email"
          autoComplete="email"
          required
          dir="ltr"
          className="nums-en w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          {dictionary.password}
        </label>
        <input
          {...bind("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          required
          dir="ltr"
          className="nums-en w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
      >
        {pending ? dictionary.submitting : dictionary.submit}
      </button>
    </form>
  );
}
