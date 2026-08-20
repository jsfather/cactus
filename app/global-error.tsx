"use client";

import "./globals.css";
import { CactusLogo } from "@/components/brand/cactus-brand";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <title>خطا | کاکتوس</title>
        <main className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-6 py-16">
          <section className="w-full rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex justify-center"><CactusLogo className="size-14" /></div>
            <h1 className="mt-6 text-2xl font-bold">مشکلی پیش آمد</h1>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              این صفحه درست بارگذاری نشد. دوباره تلاش کنید یا به صفحه اصلی برگردید.
            </p>
            {error.digest ? (
              <p className="nums-en mt-3 text-xs text-zinc-400" dir="ltr">{error.digest}</p>
            ) : null}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => retry()}
                className="rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950"
              >
                تلاش دوباره
              </button>
              {/* A global error replaces every root layout and must leave it with a document navigation. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="rounded-xl border border-zinc-200 px-5 py-2.5 font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                صفحه اصلی
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
