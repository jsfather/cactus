'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { Ticket } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useTeacherTicket } from '@/app/lib/hooks/use-teacher-ticket';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import {
  MessageCircle,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function TeacherTicketsPage() {
  const router = useRouter();
  const { ticketList, loading, fetchTicketList } = useTeacherTicket();

  useEffect(() => {
    fetchTicketList();
  }, [fetchTicketList]);

  // Calculate summary stats
  const totalTickets = ticketList.length;
  const openTickets = ticketList.filter(
    (ticket) => ticket.status === 'open'
  ).length;
  const closedTickets = ticketList.filter(
    (ticket) => ticket.status === 'closed'
  ).length;
  const pendingTickets = ticketList.filter(
    (ticket) => ticket.status === 'pending'
  ).length;

  const handleViewTicket = (ticket: Ticket) => {
    router.push(`/teacher/tickets/${ticket.id}`);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      open: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      closed:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    };

    const statusTexts = {
      open: 'باز',
      closed: 'بسته',
      pending: 'در انتظار',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}
      >
        {statusTexts[status as keyof typeof statusTexts]}
      </span>
    );
  };

  const columns: Column<Ticket>[] = [
    {
      header: 'موضوع',
      accessor: 'subject',
      render: (value, ticket: Ticket) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {ticket.subject}
        </div>
      ),
    },
    {
      header: 'دانش‌پژوه',
      accessor: 'student',
      render: (value, ticket: Ticket) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {ticket.student || 'نامشخص'}
        </div>
      ),
    },
    {
      header: 'بخش',
      accessor: 'department',
      render: (value, ticket: Ticket) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {ticket.department || 'عمومی'}
        </div>
      ),
    },
    {
      header: 'تعداد پیام‌ها',
      accessor: 'messages',
      render: (value, ticket: Ticket) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {ticket.messages?.length || 0} پیام
        </div>
      ),
    },
    {
      header: 'وضعیت',
      accessor: 'status',
      render: (value, ticket: Ticket) => getStatusBadge(ticket.status),
    },
  ];

  const breadcrumbItems = [
    { label: 'پنل مدرس', href: '/teacher' },
    { label: 'تیکت‌ها', href: '/teacher/tickets' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            تیکت‌های پشتیبانی
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            مدیریت تیکت‌های پشتیبانی دریافتی از دانش‌پژوهان
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  کل تیکت‌ها
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {totalTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  تیکت‌های باز
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {openTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  در انتظار پاسخ
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {pendingTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-gray-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  تیکت‌های بسته
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {closedTickets}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <Table
          data={ticketList}
          columns={columns}
          emptyMessage="هیچ تیکتی یافت نشد"
          actions={(ticket: Ticket) => (
            <Button
              variant="primary"
              onClick={() => handleViewTicket(ticket)}
              className="flex items-center gap-1 px-3 py-1 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              مشاهده
            </Button>
          )}
        />
      </div>
    </div>
  );
}
