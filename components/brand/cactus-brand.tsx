import type { Locale } from "@/lib/i18n/config";

export function CactusLogo({
  className = "size-11",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="15" className="fill-emerald-700 dark:fill-emerald-500" />
      <path
        d="M24 36V14M24 27h-4.5A5.5 5.5 0 0 1 14 21.5V19M24 22h4.5a5.5 5.5 0 0 0 5.5-5.5V14"
        className="stroke-white dark:stroke-emerald-950"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="15" r="1.15" className="fill-emerald-700 dark:fill-emerald-500" />
      <circle cx="26" cy="15" r="1.15" className="fill-emerald-700 dark:fill-emerald-500" />
    </svg>
  );
}

export function CactusBrand({
  locale = "fa",
  compact = false,
  subtitle,
}: {
  locale?: Locale;
  compact?: boolean;
  subtitle?: string;
}) {
  const name = locale === "fa" ? "مدرسه رباتیک کاکتوس" : "Cactus Robotics School";

  return (
    <span className="inline-flex min-w-0 items-center gap-3">
      <CactusLogo className="size-10 shrink-0 sm:size-11" />
      {!compact ? (
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-bold text-zinc-950 dark:text-zinc-50">
            {name}
          </span>
          {subtitle ? (
            <span className="mt-1 block truncate text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
