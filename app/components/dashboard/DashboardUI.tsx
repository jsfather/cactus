'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

type Tone = 'blue' | 'purple' | 'emerald' | 'amber';

const toneClasses: Record<Tone, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple:
    'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  emerald:
    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};

export function DashboardHeader({
  title,
  description,
  onRefresh,
  refreshing = false,
}: {
  title: string;
  description: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      {onRefresh && (
        <Button
          type="button"
          variant="secondary"
          className="w-full shrink-0 sm:w-auto"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`ml-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          بروزرسانی داده‌ها
        </Button>
      )}
    </div>
  );
}

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: Tone;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        </div>
        <div className={`shrink-0 rounded-full p-3 ${toneClasses[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-800 dark:ring-white/10">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export interface DashboardAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
}

export function DashboardQuickActions({
  actions,
}: {
  actions: DashboardAction[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="group flex min-w-0 items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700/50"
          >
            <span
              className={`shrink-0 rounded-lg p-2.5 ${toneClasses[action.tone]}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-gray-900 group-hover:text-gray-950 dark:text-white">
                {action.title}
              </span>
              <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                {action.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function DashboardEmptyState({ message }: { message: string }) {
  return (
    <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
      {message}
    </p>
  );
}
