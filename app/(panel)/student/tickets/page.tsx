'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';
import { Ticket } from '@/app/lib/types';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  Plus,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

const statusIcons: Record<string, React.ReactElement> = {
  open: <Clock className="h-4 w-4" />,
  closed: <CheckCircle className="h-4 w-4" />,
  pending: <AlertCircle className="h-4 w-4" />,
};

const statusTranslations: Record<string, string> = {
  open: 'باز',
  closed: 'بسته',
  pending: 'در انتظار',
};

export default function StudentTicketsPage() {
  const router = useRouter();
  const { tickets, isListLoading, fetchTickets, error } = useStudentTicket();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const breadcrumbItems = [
    { label: 'پنل دانش‌آموز', href: '/student' },
    { label: 'تیکت‌ها', href: '/student/tickets', active: true },
  ];

  // Statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (ticket) => ticket.status === 'open'
  ).length;
  const closedTickets = tickets.filter(
    (ticket) => ticket.status === 'closed'
  ).length;
  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === 'pending'
  ).length;

  if (isListLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  کل تیکت‌ها
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {totalTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  تیکت‌های باز
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {openTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  در انتظار پاسخ
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {pendingTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  تیکت‌های بسته
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {closedTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            تیکت‌های پشتیبانی
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            مدیریت تیکت‌ها و درخواست‌های پشتیبانی
          </p>
        </div>
        <Link href="/student/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            تیکت جدید
          </Button>
        </Link>
      </div>

      {/* Tickets List */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md dark:bg-gray-800">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.length === 0 ? (
            <li className="px-6 py-4">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    هیچ تیکتی موجود نیست
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    برای شروع، تیکت جدیدی ایجاد کنید
                  </p>
                  <div className="mt-6">
                    <Link href="/student/tickets/new">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        تیکت جدید
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ) : (
            tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  href={`/student/tickets/${ticket.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {statusIcons[ticket.status]}
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {ticket.subject}
                          </p>
                          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="truncate">
                              بخش: {ticket.department || '-'}
                            </span>
                            {ticket.teacher && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="truncate">
                                  مدرس: {ticket.teacher}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusColors[ticket.status]
                          }`}
                        >
                          {statusTranslations[ticket.status] || ticket.status}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="ml-1 h-4 w-4 flex-shrink-0" />
                          {ticket.created_at
                            ? new Date(ticket.created_at).toLocaleDateString(
                                'fa-IR'
                              )
                            : '-'}
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
