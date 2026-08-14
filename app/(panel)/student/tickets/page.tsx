'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { TicketCenter } from '@/app/components/tickets/TicketCenter';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';

export default function StudentTicketsPage() {
  const { tickets, isListLoading, fetchTickets } = useStudentTicket();

  useEffect(() => {
    void fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل دانش‌پژوه', href: '/student' },
          { label: 'تیکت‌های من', href: '/student/tickets' },
        ]}
      />
      <TicketCenter
        tickets={tickets}
        loading={isListLoading}
        title="درخواست‌های پشتیبانی من"
        description="وضعیت درخواست‌ها و پاسخ‌های تیم پشتیبانی را از اینجا پیگیری کنید"
        detailBasePath="/student/tickets"
        primaryAction={
          <Link
            href="/student/tickets/create"
            className="bg-primary-600 hover:bg-primary-500 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white transition"
          >
            <Plus className="h-4 w-4" />
            ثبت تیکت جدید
          </Link>
        }
      />
    </div>
  );
}
