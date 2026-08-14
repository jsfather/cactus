'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import TicketConversation from '@/app/components/ui/TicketConversation';
import { TicketDetailHeader } from '@/app/components/tickets/TicketCenter';
import { useTeacherTicket } from '@/app/lib/hooks/use-teacher-ticket';

export default function TeacherTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const { currentTicket, loading, fetchTicketById, replyToTicket } =
    useTeacherTicket();
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (ticketId) void fetchTicketById(ticketId);
  }, [fetchTicketById, ticketId]);

  const handleSendMessage = async (message: string) => {
    try {
      setSendingMessage(true);
      await replyToTicket(ticketId, { message });
      return true;
    } catch {
      return false;
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading && !currentTicket) return <LoadingSpinner />;

  if (!currentTicket) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          تیکت یافت نشد یا دسترسی به آن ممکن نیست
        </h1>
        <Button
          className="mx-auto mt-5"
          onClick={() => router.push('/teacher/tickets')}
        >
          بازگشت به صندوق تیکت‌ها
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدرس', href: '/teacher' },
          { label: 'صندوق تیکت‌ها', href: '/teacher/tickets' },
          {
            label: `تیکت #${currentTicket.id}`,
            href: `/teacher/tickets/${ticketId}`,
          },
        ]}
      />
      <TicketDetailHeader
        ticket={currentTicket}
        backHref="/teacher/tickets"
        audienceLabel="دانش‌پژوه"
      />
      <TicketConversation
        messages={currentTicket.messages}
        sendingMessage={sendingMessage}
        onSendMessage={handleSendMessage}
        ticketStatus={currentTicket.status}
        viewerRole="support"
        composerLabel="پاسخ شما به دانش‌پژوه"
      />
    </div>
  );
}
