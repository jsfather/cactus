"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

type Theme = "system" | "light" | "dark";

const storageKey = "cactus-theme";

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

function applyTheme(theme: Theme) {
  const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemIsDark);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "light") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3.5" />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
    );
  }

  if (theme === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function PreferencesMenu({
  locale = "fa",
  alternateHref,
}: {
  locale?: Locale;
  alternateHref?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "system";

    const bootstrappedTheme = document.documentElement.dataset.theme ?? null;
    return isTheme(bootstrappedTheme) ? bootstrappedTheme : "system";
  });
  const isFa = locale === "fa";
  const labels = isFa
    ? {
        menu: "تنظیمات نمایش",
        appearance: "پوسته",
        system: "سیستم",
        light: "روشن",
        dark: "تیره",
        language: "زبان",
        alternate: "English",
      }
    : {
        menu: "Display settings",
        appearance: "Theme",
        system: "System",
        light: "Light",
        dark: "Dark",
        language: "Language",
        alternate: "فارسی",
      };

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") applyTheme("system");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const selectTheme = (nextTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {}

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const themeOptions: Array<{ value: Theme; label: string }> = [
    { value: "system", label: labels.system },
    { value: "light", label: labels.light },
    { value: "dark", label: labels.dark },
  ];

  return (
    <details className="group/preferences relative z-40">
      <summary
        aria-label={labels.menu}
        title={labels.menu}
        className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 [&::-webkit-details-marker]:hidden"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8M12 3c2 2.4 3 5.4 3 9s-1 6.6-3 9c-2-2.4-3-5.4-3-9s1-6.6 3-9Z" />
        </svg>
      </summary>

      <div className="absolute end-0 top-full mt-2 w-64 rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl shadow-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30">
        <p className="px-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {labels.appearance}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              suppressHydrationWarning
              aria-pressed={theme === option.value}
              onClick={() => selectTheme(option.value)}
              className="flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-zinc-600 transition hover:text-zinc-950 aria-pressed:bg-white aria-pressed:text-emerald-800 aria-pressed:shadow-sm dark:text-zinc-400 dark:hover:text-zinc-100 dark:aria-pressed:bg-zinc-700 dark:aria-pressed:text-emerald-300"
            >
              <ThemeIcon theme={option.value} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {alternateHref ? (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-200 px-1 pt-3 dark:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {labels.language}
            </span>
            <a
              href={alternateHref}
              hrefLang={isFa ? "en" : "fa"}
              className="nums-en rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950"
            >
              {labels.alternate}
            </a>
          </div>
        ) : null}
      </div>
    </details>
  );
}
