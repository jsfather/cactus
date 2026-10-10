"use client";
import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { localizePath, type Locale } from "@/lib/i18n/config";
export function SearchForm({
  locale,
  query,
}: {
  locale: Locale;
  query: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        e.key === "/" &&
        !target.closest("input,textarea,select,[contenteditable]")
      ) {
        e.preventDefault();
        ref.current?.focus();
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  return (
    <form
      action={localizePath(locale, "/search")}
      className="public-search-form"
      role="search"
      aria-busy={pending}
      onSubmit={(event) => {
        event.preventDefault();
        const q =
          new FormData(event.currentTarget).get("q")?.toString().trim() ?? "";
        startTransition(() =>
          router.push(
            `${localizePath(locale, "/search")}?${new URLSearchParams({ q })}`,
            { scroll: false },
          ),
        );
      }}
    >
      <label htmlFor="cactus-search" className="sr-only">
        {locale === "fa" ? "جست‌وجو در کاکتوس" : "Search Cactus"}
      </label>
      <input
        ref={ref}
        key={query}
        id="cactus-search"
        name="q"
        type="search"
        maxLength={100}
        defaultValue={query}
        placeholder={
          locale === "fa"
            ? "دوره، محصول، مقاله یا مدرس…"
            : "Course, product, article, or teacher…"
        }
        className="border px-4 py-3"
      />
      <SearchButton locale={locale} pending={pending} />
    </form>
  );
}
function SearchButton({
  locale,
  pending,
}: {
  locale: Locale;
  pending: boolean;
}) {
  return (
    <button className="public-button shrink-0" type="submit" disabled={pending}>
      {pending
        ? locale === "fa"
          ? "در حال جست‌وجو…"
          : "Searching…"
        : locale === "fa"
          ? "جست‌وجو"
          : "Search"}
      <span aria-hidden="true">↵</span>
    </button>
  );
}
