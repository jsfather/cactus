'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Ticket } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';

export default function Page() {
  const router = useRouter();
  const {
    tickets,
    isListLoading: loading,
    fetchTickets,
    error,
  } = useStudentTicket();

  const columns: Column<Ticket>[] = [
    {
      header: 'موضوع',
      accessor: 'subject',
    },
    {
      header: 'وضعیت',
      accessor: 'status',
      render: (value) => {
        if (typeof value === 'string') {
          const statusMap = {
            open: 'باز',
            closed: 'بسته',
            pending: 'در انتظار',
          };
          return statusMap[value as keyof typeof statusMap] || value;
        }
        return String(value || '');
      },
    },
    {
      header: 'بخش',
      accessor: 'department',
    },
    {
      header: 'مدرس',
      accessor: 'teacher',
      render: (value) => String(value || '-'),
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value) => {
        if (typeof value === 'string') {
          return new Date(value).toLocaleDateString('fa-IR');
        }
        return '-';
      },
    },
  ];

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تیکت‌ها', href: '/student/tickets', active: true },
        ]}
      />

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-8m-8 0h8m0 0v-3a2 2 0 00-2-2H6a2 2 0 00-2 2v3"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل تیکت‌ها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {tickets.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    تیکت‌های باز
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      tickets.filter((ticket) => ticket.status === 'open')
                        .length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    در انتظار پاسخ
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      tickets.filter((ticket) => ticket.status === 'pending')
                        .length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    تیکت‌های بسته
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      tickets.filter((ticket) => ticket.status === 'closed')
                        .length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تیکت‌ها
        </h1>
        <Button onClick={() => router.push('/student/tickets/new')}>
          ایجاد تیکت
        </Button>
      </div>

      <div className="mt-8">
        <Table
          data={tickets}
          columns={columns}
          loading={loading}
          emptyMessage="هیچ تیکتی یافت نشد"
          onEdit={(ticket) => router.push(`/student/tickets/${ticket.id}`)}
        />
      </div>
    </main>
  );
}
