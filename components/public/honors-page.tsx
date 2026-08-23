import { connection } from "next/server";
import { HonorCard } from "@/components/honors/honor-card";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getPublishedHonors } from "@/lib/honors/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export async function HonorsPage({ locale }: { locale: Locale }) {
  await connection();
  const [honors, dictionary] = await Promise.all([getPublishedHonors(), Promise.resolve(getDictionary(locale))]);
  return <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"><SiteHeader locale={locale} currentPath="/honors" /><main><header className="border-b border-emerald-950/10 bg-emerald-50 dark:border-white/10 dark:bg-emerald-950/25"><div className="mx-auto w-full max-w-7xl px-5 py-16 text-start sm:px-8 sm:py-24 lg:px-10"><div className="grid size-12 place-items-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 dark:bg-emerald-500 dark:text-emerald-950"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="9" r="5" /><path strokeLinecap="round" strokeLinejoin="round" d="m8.5 13-1 8 4.5-2.5 4.5 2.5-1-8" /></svg></div><h1 className="mt-6 text-4xl font-black sm:text-5xl">{dictionary.honorsTitle}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">{dictionary.honorsDescription}</p></div></header><section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">{honors.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{honors.map((honor) => <HonorCard key={honor.id} honor={honor} locale={locale} />)}</div> : <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">{dictionary.emptyHonors}</p>}</section></main><SiteFooter locale={locale} /></div>;
}
