'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { TicketCenter } from '@/app/components/tickets/TicketCenter';
import { useTicket } from '@/app/lib/hooks/use-ticket';

export default function TicketsPage() {
  const { tickets, isListLoading, fetchAllTickets } = useTicket();

  useEffect(() => {
    void fetchAllTickets();
  }, [fetchAllTickets]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'صندوق تیکت‌ها', href: '/admin/tickets', active: true },
        ]}
      />
      <TicketCenter
        tickets={tickets}
        loading={isListLoading}
        title="صندوق پشتیبانی"
        description="بررسی، اولویت‌بندی و پاسخ‌گویی به درخواست‌های دانش‌پژوهان و مدرسین"
        detailBasePath="/admin/tickets"
        showTypeFilter
        secondaryAction={
          <Link
            href="/admin/tickets/departments"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-gray-900 ring-1 ring-gray-300 transition ring-inset hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800"
          >
            <Building2 className="h-4 w-4" />
            مدیریت دپارتمان‌ها
          </Link>
        }
      />
    </div>
  );
}
