'use client';

import { useEffect } from 'react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { TicketCenter } from '@/app/components/tickets/TicketCenter';
import { useTeacherTicket } from '@/app/lib/hooks/use-teacher-ticket';

export default function TeacherTicketsPage() {
  const { ticketList, loading, fetchTicketList } = useTeacherTicket();

  useEffect(() => {
    void fetchTicketList();
  }, [fetchTicketList]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدرس', href: '/teacher' },
          { label: 'صندوق تیکت‌ها', href: '/teacher/tickets' },
        ]}
      />
      <TicketCenter
        tickets={ticketList}
        loading={loading}
        title="صندوق پشتیبانی دانش‌پژوهان"
        description="درخواست‌های دانش‌پژوهان را ببینید و پاسخ را در همان گفتگو ارسال کنید"
        detailBasePath="/teacher/tickets"
      />
    </div>
  );
}
