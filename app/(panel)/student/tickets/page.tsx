'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Ticket } from '@/app/lib/types/ticket';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import {
  Ticket as TicketIcon,
  Plus,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function TicketsPage() {
  const router = useRouter();
  const { tickets, isListLoading, fetchTickets } = useStudentTicket();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Calculate summary stats
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

  const breadcrumbItems = [
    { label: 'پنل دانشجو', href: '/student' },
    { label: 'تیکت‌ها', href: '/student/tickets' },
  ];

  const columns: Column<Ticket>[] = [
    {
      header: 'موضوع',
      accessor: 'subject',
    },
    {
      header: 'دپارتمان',
      accessor: 'department',
    },
    {
      header: 'وضعیت',
      accessor: 'status',
      render: (value): any => {
        const statusColors = {
          open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          closed:
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          pending:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        const statusText = {
          open: 'باز',
          closed: 'بسته',
          pending: 'در انتظار',
        };
        const status = value as keyof typeof statusColors;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
          >
            {statusText[status]}
          </span>
        );
      },
    },
    {
      header: 'تعداد پیام‌ها',
      accessor: 'messages',
      render: (value): string => {
        const messages = value as any[];
        return Array.isArray(messages) ? messages.length.toString() : '0';
      },
    },
    {
      header: 'آخرین پیام',
      accessor: 'messages',
      render: (value): string => {
        const messages = value as any[];
        if (!Array.isArray(messages) || messages.length === 0) return '-';
        const lastMessage = messages[messages.length - 1];
        return new Date(lastMessage.created_at).toLocaleDateString('fa-IR');
      },
    },
    {
      header: 'عملیات',
      accessor: 'id',
      render: (value, row): any => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/student/tickets/${value}`)}
          >
            <Eye className="h-4 w-4" />
            مشاهده
          </Button>
        </div>
      ),
    },
  ];

  if (isListLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <TicketIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              مدیریت تیکت‌ها
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              مدیریت و پیگیری تیکت‌های پشتیبانی
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/student/tickets/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          تیکت جدید
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TicketIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mr-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                کل تیکت‌ها
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTickets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="mr-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تیکت‌های باز
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {openTickets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="mr-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                در انتظار پاسخ
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingTickets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="mr-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تیکت‌های بسته
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {closedTickets}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <Table
          data={tickets}
          columns={columns}
          loading={isListLoading}
          emptyMessage="هیچ تیکتی یافت نشد"
        />
      </div>
    </div>
  );
}
