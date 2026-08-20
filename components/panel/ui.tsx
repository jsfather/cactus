import Link from "next/link";
import type { ReactNode } from "react";

export const panelInputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:disabled:bg-zinc-900";

export const panelTextareaClass =
  "w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:disabled:bg-zinc-900";

export const panelSelectClass =
  "w-full cursor-pointer appearance-none rounded-xl border border-zinc-300 bg-white py-3 ps-4 pe-10 text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export const primaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300";

export const dangerButtonClass =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/40";

export function PanelPage({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl space-y-8">{children}</div>;
}

export function PanelPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}

export function PanelSurface({ children }: { children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {children}
    </section>
  );
}

export function PanelFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-start dark:border-zinc-800 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-zinc-50/70 px-5 py-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h2>
        {description ? <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">{description}</p> : null}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function PanelFormFooter({
  message,
  error,
  children,
}: {
  message?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <footer className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-zinc-800 dark:bg-zinc-950">
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <p className="max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">{message}</p>
      )}
      <div className="flex shrink-0 flex-wrap gap-3">{children}</div>
    </footer>
  );
}

export function PanelPrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={primaryButtonClass}>
      {children}
    </Link>
  );
}

export function PanelBackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
    >
      {children}
    </Link>
  );
}

export function PanelTable({
  columns,
  children,
  minWidth = "min-w-4xl",
}: {
  columns: Array<{ label: string; className?: string }>;
  children: ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full table-fixed text-sm ${minWidth}`}>
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-5 py-4 text-start align-middle font-medium ${column.className ?? ""}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function PanelTableCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-5 py-4 text-start align-middle ${className}`}>
      {children}
    </td>
  );
}

export function PanelEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <h2 className="font-bold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function PanelDashboardCard({
  href,
  eyebrow,
  title,
  description,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-800"
    >
      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-xl font-bold text-zinc-950 group-hover:text-emerald-800 dark:text-zinc-50 dark:group-hover:text-emerald-300">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </Link>
  );
}
