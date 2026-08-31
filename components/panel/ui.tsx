import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type PanelControlSize = "compact" | "default";

const panelFieldBaseClass =
  "w-full border border-zinc-300 bg-white text-start text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:disabled:bg-zinc-900";

const panelInputSizeClass: Record<PanelControlSize, string> = {
  compact: "h-9 rounded-lg px-3 text-sm",
  default: "rounded-xl px-4 py-3",
};

export function getPanelInputClass(size: PanelControlSize = "default") {
  return `${panelFieldBaseClass} ${panelInputSizeClass[size]}`;
}

export const panelInputClass = getPanelInputClass();

export const panelTextareaClass =
  "w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-start text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:disabled:bg-zinc-900";

const panelSelectBaseClass =
  "w-full cursor-pointer appearance-none border border-zinc-300 bg-white text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

const panelSelectSizeClass: Record<PanelControlSize, string> = {
  compact: "h-9 rounded-lg py-0 ps-3 pe-10 text-sm",
  default: "rounded-xl py-3 ps-4 pe-10",
};

export function getPanelSelectClass(size: PanelControlSize = "default") {
  return `${panelSelectBaseClass} ${panelSelectSizeClass[size]}`;
}

export const panelSelectClass = getPanelSelectClass();

type PanelButtonTone = "primary" | "secondary";

const panelButtonBaseClass =
  "inline-flex cursor-pointer items-center justify-center font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

const panelButtonToneClass: Record<PanelButtonTone, string> = {
  primary: "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400",
  secondary: "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300",
};

const panelButtonSizeClass: Record<PanelControlSize, string> = {
  compact: "h-9 gap-1.5 rounded-lg px-3 text-sm",
  default: "rounded-xl px-5 py-3 text-sm font-semibold",
};

export function getPanelButtonClass(
  tone: PanelButtonTone,
  size: PanelControlSize = "default",
) {
  return `${panelButtonBaseClass} ${panelButtonToneClass[tone]} ${panelButtonSizeClass[size]}`;
}

export const primaryButtonClass = getPanelButtonClass("primary");

export const secondaryButtonClass = getPanelButtonClass("secondary");

const tableActionBaseClass =
  "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-45";

const tableActionTone = {
  edit: "border-zinc-200 bg-white text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-emerald-400 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/50",
  copy: "border-zinc-200 bg-white text-sky-700 hover:border-sky-300 hover:bg-sky-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-sky-400 dark:hover:border-sky-700 dark:hover:bg-sky-950/50",
  danger: "border-zinc-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/50",
} as const;

export function PanelTableActions({ children }: { children: ReactNode }) {
  return <div className="flex max-w-full flex-wrap items-center gap-1">{children}</div>;
}

export function PanelTableActionLink({ href, label, tone = "edit", children }: { href: string; label: string; tone?: keyof typeof tableActionTone; children: ReactNode }) {
  return <Link href={href} aria-label={label} title={label} className={`${tableActionBaseClass} ${tableActionTone[tone]}`}>{children}</Link>;
}

export function PanelTableActionButton({ label, tone = "edit", className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: keyof typeof tableActionTone }) {
  return <button type="button" aria-label={label} title={label} className={`${tableActionBaseClass} ${tableActionTone[tone]} ${className}`} {...props}>{children}</button>;
}

export function PanelEditIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="m12.8 3.7 3.5 3.5M4.5 15.5l1-4.2L13.8 3a1.4 1.4 0 0 1 2 0l1.2 1.2a1.4 1.4 0 0 1 0 2l-8.3 8.3-4.2 1Z" /></svg>;
}

export function PanelDeleteIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M3.5 5.5h13M8 8.5v5m4-5v5M6 5.5l.6 10h6.8l.6-10M8 5.5V4h4v1.5" /></svg>;
}

export function PanelCopyIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="6.5" y="6.5" width="9" height="9" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.5V5A1.5 1.5 0 0 0 12 3.5H5A1.5 1.5 0 0 0 3.5 5v7A1.5 1.5 0 0 0 5 13.5h1.5" /></svg>;
}

export function PanelReviewIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M3.5 10s2.3-4 6.5-4 6.5 4 6.5 4-2.3 4-6.5 4-6.5-4-6.5-4Z" /><circle cx="10" cy="10" r="2" /></svg>;
}

export function PanelRegisterIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3.5h10a2 2 0 0 1 2 2v11H3v-11a2 2 0 0 1 2-2Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m6.5 9 1.5 1.5 3-3M6.5 13.5h7M13 8h1" /></svg>;
}

export function PanelActionSpinner() {
  return <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

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

export function PanelSurface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 ${className}`}>
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
  size = "default",
  children,
}: {
  href: string;
  size?: PanelControlSize;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={getPanelButtonClass("primary", size)}>
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
}: {
  columns: Array<{ label: string; className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="w-full min-w-0 overflow-hidden">
      <table className="w-full min-w-0 table-fixed text-xs sm:text-sm">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`overflow-hidden px-2.5 py-3 text-start align-middle font-medium [overflow-wrap:anywhere] sm:px-3 sm:py-4 lg:px-4 ${column.className ?? ""}`}
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
    <td className={`overflow-hidden px-2.5 py-3 text-start align-middle [overflow-wrap:anywhere] sm:px-3 sm:py-4 lg:px-4 ${className}`}>
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
