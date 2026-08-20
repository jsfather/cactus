"use client";

import { useEffect, useState } from "react";
import { SelectChevron } from "@/components/ui/select-chevron";

type Theme = "light" | "dark" | "system";

const storageKey = "cactus-theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && prefersDark);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
}

export function ThemeSelect({ locale = "fa" }: { locale?: "fa" | "en" }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    try {
      const storedTheme = localStorage.getItem(storageKey);
      return isTheme(storedTheme) ? storedTheme : "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    applyTheme(theme);
    media.addEventListener("change", handleSystemChange);

    return () => media.removeEventListener("change", handleSystemChange);
  }, [theme]);

  const labels =
    locale === "fa"
      ? { aria: "انتخاب پوسته", system: "سیستم", light: "روشن", dark: "تیره" }
      : { aria: "Choose theme", system: "System", light: "Light", dark: "Dark" };

  return (
    <label className="relative inline-flex min-w-24 items-center">
      <span className="sr-only">{labels.aria}</span>
      <select
        suppressHydrationWarning
        aria-label={labels.aria}
        value={theme}
        onChange={(event) => {
          const nextTheme = event.target.value as Theme;
          localStorage.setItem(storageKey, nextTheme);
          setTheme(nextTheme);
          applyTheme(nextTheme);
        }}
        className="nums-en w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2 ps-3 pe-9 text-xs font-medium text-zinc-700 outline-none transition hover:border-emerald-300 focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
      >
        <option value="system">{labels.system}</option>
        <option value="light">{labels.light}</option>
        <option value="dark">{labels.dark}</option>
      </select>
      <SelectChevron />
    </label>
  );
}
