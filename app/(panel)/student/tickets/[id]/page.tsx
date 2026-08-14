'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import TicketConversation from '@/app/components/ui/TicketConversation';
import { TicketDetailHeader } from '@/app/components/tickets/TicketCenter';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';

export default function StudentTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { currentTicket, isLoading, fetchTicketById, clearCurrentTicket } =
    useStudentTicket();

  useEffect(() => {
    void fetchTicketById(id);
    return clearCurrentTicket;
  }, [clearCurrentTicket, fetchTicketById, id]);

  if (isLoading && !currentTicket) return <LoadingSpinner />;

  if (!currentTicket) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          تیکت یافت نشد
        </h1>
        <Button
          className="mx-auto mt-5"
          onClick={() => router.push('/student/tickets')}
        >
          بازگشت به تیکت‌های من
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل دانش‌پژوه', href: '/student' },
          { label: 'تیکت‌های من', href: '/student/tickets' },
          {
            label: `تیکت #${currentTicket.id}`,
            href: `/student/tickets/${id}`,
          },
        ]}
      />
      <TicketDetailHeader ticket={currentTicket} backHref="/student/tickets" />
      <TicketConversation
        messages={currentTicket.messages}
        ticketStatus={currentTicket.status}
        viewerRole="student"
      />
    </div>
  );
}
