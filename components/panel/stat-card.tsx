import Link from "next/link";
import type { ReactNode } from "react";
const tones = {
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  violet:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
};
export function PanelStatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}
export function PanelStatCard({
  label,
  value,
  detail,
  href,
  tone = "emerald",
  icon = "box",
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  href?: string;
  tone?: keyof typeof tones;
  icon?: "box" | "clock" | "trend" | "people" | "message";
}) {
  const content = (
    <>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
          {label}
        </p>
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {icon === "clock" ? (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </>
            ) : icon === "trend" ? (
              <>
                <path d="m3 17 6-6 4 4 8-11M15 4h6v6" />
                <path d="M3 21h18" />
              </>
            ) : icon === "people" ? (
              <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 5" />
              </>
            ) : icon === "message" ? (
              <path d="M4 4h16v13H9l-5 4V4Zm4 5h8M8 13h5" />
            ) : (
              <>
                <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V8M12 13v10M7 5l9 5" />
              </>
            )}
          </svg>
        </span>
      </div>
      <p className="mt-4 break-words text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
        {value}
      </p>
      {detail && (
        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {detail}
        </p>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
      />
    </>
  );
  const className =
    "relative min-w-0 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none dark:border-zinc-800 dark:bg-zinc-950";
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <section className={className}>{content}</section>
  );
}
