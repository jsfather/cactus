import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { CactusBrand } from "@/components/brand/cactus-brand";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
import { getCurrentUser } from "@/lib/auth/session";
import { getAuthDictionary } from "@/lib/i18n/auth";
import { localizePath } from "@/lib/i18n/config";
import { getPreferredLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getAuthDictionary(await getPreferredLocale());
  return { title: dictionary.registerMetadataTitle, description: dictionary.registerMetadataDescription };
}

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/panel");
  const locale = await getPreferredLocale();
  const dictionary = getAuthDictionary(locale);
  const alternateLocale = locale === "fa" ? "en" : "fa";
  const languageHref = `/api/preferences/locale?locale=${alternateLocale}&returnTo=${encodeURIComponent("/register")}`;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <a href={localizePath(locale, "/")} className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400">{dictionary.backHome}</a>
        <PreferencesMenu locale={locale} alternateHref={languageHref} />
      </div>
      <section className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-emerald-950/5 sm:p-9 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-8 space-y-2">
          <div className="mb-7"><CactusBrand locale={locale} /></div>
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{dictionary.registerTitle}</h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{dictionary.registerDescription}</p>
        </div>
        <RegisterForm locale={locale} />
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">{dictionary.alreadyAccount}{" "}<a href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">{dictionary.loginLink}</a></p>
      </section>
    </main>
  );
}
