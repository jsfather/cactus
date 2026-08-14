'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Inbox,
  MessageCircle,
  Search,
  UserRound,
  UsersRound,
} from 'lucide-react';
import type { Ticket } from '@/app/lib/types/ticket';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

type TicketTypeFilter = 'all' | 'student' | 'teacher';
type TicketStatusFilter = 'all' | Ticket['status'];

const statusConfig: Record<
  Ticket['status'],
  { label: string; className: string; icon: typeof Clock3 }
> = {
  open: {
    label: 'باز',
    className:
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-400/20',
    icon: CheckCircle2,
  },
  pending: {
    label: 'در انتظار پاسخ',
    className:
      'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-400/20',
    icon: Clock3,
  },
  closed: {
    label: 'بسته',
    className:
      'bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-400/20',
    icon: AlertCircle,
  },
};

export function TicketStatusBadge({ status }: { status: Ticket['status'] }) {
  const config = statusConfig[status] ?? statusConfig.open;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function formatTicketDate(value?: string) {
  if (!value) return 'بدون تاریخ';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TicketStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  tone: 'blue' | 'emerald' | 'amber' | 'gray';
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    emerald:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber:
      'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <span className={`shrink-0 rounded-lg p-2.5 ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString('fa-IR')}
        </p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}

interface TicketCenterProps {
  tickets: Ticket[];
  loading: boolean;
  title: string;
  description: string;
  detailBasePath: string;
  showTypeFilter?: boolean;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  emptyMessage?: string;
}

export function TicketCenter({
  tickets,
  loading,
  title,
  description,
  detailBasePath,
  showTypeFilter = false,
  primaryAction,
  secondaryAction,
  emptyMessage = 'تیکتی برای نمایش وجود ندارد.',
}: TicketCenterProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TicketStatusFilter>('all');
  const [type, setType] = useState<TicketTypeFilter>('all');

  const filteredTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fa');

    return [...tickets]
      .filter((ticket) => status === 'all' || ticket.status === status)
      .filter(
        (ticket) => !showTypeFilter || type === 'all' || ticket.type === type
      )
      .filter((ticket) => {
        if (!normalizedQuery) return true;
        const searchable = [
          ticket.subject,
          ticket.student,
          ticket.teacher,
          ticket.department,
          ticket.id.toString(),
          ticket.messages?.at(-1)?.message,
        ]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('fa');
        return searchable.includes(normalizedQuery);
      })
      .sort((a, b) => {
        const aDate = new Date(a.updated_at || a.created_at || 0).getTime();
        const bDate = new Date(b.updated_at || b.created_at || 0).getTime();
        return bDate - aDate;
      });
  }, [query, showTypeFilter, status, tickets, type]);

  const openCount = tickets.filter((ticket) => ticket.status === 'open').length;
  const pendingCount = tickets.filter(
    (ticket) => ticket.status === 'pending'
  ).length;
  const closedCount = tickets.filter(
    (ticket) => ticket.status === 'closed'
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <TicketStat
          label="همه تیکت‌ها"
          value={tickets.length}
          icon={Inbox}
          tone="blue"
        />
        <TicketStat
          label="باز"
          value={openCount}
          icon={CheckCircle2}
          tone="emerald"
        />
        <TicketStat
          label="در انتظار پاسخ"
          value={pendingCount}
          icon={Clock3}
          tone="amber"
        />
        <TicketStat
          label="بسته"
          value={closedCount}
          icon={AlertCircle}
          tone="gray"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative min-w-0 flex-1 xl:max-w-md">
              <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو در موضوع، کاربر، بخش یا شماره تیکت..."
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm text-gray-900 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {showTypeFilter && (
                <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
                  {(
                    [
                      ['all', 'همه کاربران'],
                      ['student', 'دانش‌پژوه'],
                      ['teacher', 'مدرس'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setType(value)}
                      className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition sm:flex-none ${
                        type === value
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TicketStatusFilter)
                }
                aria-label="فیلتر وضعیت تیکت"
                className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="open">باز</option>
                <option value="pending">در انتظار پاسخ</option>
                <option value="closed">بسته</option>
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {filteredTickets.length.toLocaleString('fa-IR')} نتیجه از{' '}
            {tickets.length.toLocaleString('fa-IR')} تیکت
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Inbox className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">
              نتیجه‌ای پیدا نشد
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {query || status !== 'all' || type !== 'all'
                ? 'عبارت جستجو یا فیلترها را تغییر دهید.'
                : emptyMessage}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTickets.map((ticket) => {
              const lastMessage = ticket.messages?.at(-1);
              const userName =
                ticket.student || ticket.teacher || 'کاربر نامشخص';
              return (
                <li key={`${ticket.type || 'ticket'}-${ticket.id}`}>
                  <Link
                    href={`${detailBasePath}/${ticket.id}`}
                    className="group grid min-w-0 gap-3 p-4 transition hover:bg-gray-50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5 dark:hover:bg-gray-700/40"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 mt-0.5 shrink-0 rounded-lg p-2.5">
                        {ticket.type === 'teacher' ? (
                          <UsersRound className="h-5 w-5" />
                        ) : (
                          <UserRound className="h-5 w-5" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <h2 className="min-w-0 font-semibold break-words text-gray-900 group-hover:text-gray-950 dark:text-white">
                            {ticket.subject}
                          </h2>
                          <TicketStatusBadge status={ticket.status} />
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                          {lastMessage?.message ||
                            ticket.description ||
                            'بدون متن پیام'}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{userName}</span>
                          <span>{ticket.department || 'عمومی'}</span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {(ticket.messages?.length || 0).toLocaleString(
                              'fa-IR'
                            )}{' '}
                            پیام
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 pr-12 sm:flex-col sm:items-end sm:pr-0">
                      <time className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTicketDate(
                          ticket.updated_at || ticket.created_at
                        )}
                      </time>
                      <span className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 text-xs font-medium">
                        مشاهده گفتگو
                        <ChevronLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export function TicketDetailHeader({
  ticket,
  backHref,
  actions,
  audienceLabel,
}: {
  ticket: Ticket;
  backHref: string;
  actions?: ReactNode;
  audienceLabel?: string;
}) {
  const userName = ticket.student || ticket.teacher || 'کاربر نامشخص';

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              بازگشت به صندوق تیکت‌ها
            </Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              تیکت #{ticket.id}
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="min-w-0 text-2xl font-bold break-words text-gray-900 dark:text-white">
              {ticket.subject}
            </h1>
            <TicketStatusBadge status={ticket.status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4" />
              {audienceLabel ? `${audienceLabel}: ` : ''}
              {userName}
            </span>
            <span>{ticket.department || 'دپارتمان عمومی'}</span>
            <span>{formatTicketDate(ticket.created_at)}</span>
            <span>
              {(ticket.messages?.length || 0).toLocaleString('fa-IR')} پیام
            </span>
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
