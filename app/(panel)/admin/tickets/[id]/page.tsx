'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import TicketConversation from '@/app/components/ui/TicketConversation';
import { TicketDetailHeader } from '@/app/components/tickets/TicketCenter';
import { useTicket } from '@/app/lib/hooks/use-ticket';

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    currentTicket,
    isLoading,
    fetchTicketById,
    closeTicket,
    replyToTicket,
    clearCurrentTicket,
  } = useTicket();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    void fetchTicketById(id);
    return clearCurrentTicket;
  }, [clearCurrentTicket, fetchTicketById, id]);

  const handleSendMessage = async (message: string) => {
    try {
      setSendingMessage(true);
      await replyToTicket(id, { message });
      return true;
    } catch {
      return false;
    } finally {
      setSendingMessage(false);
    }
  };

  const handleClose = async () => {
    if (!currentTicket || currentTicket.status === 'closed') return;
    if (
      !window.confirm(
        'این تیکت بسته شود؟ پس از بستن امکان پاسخ جدید وجود ندارد.'
      )
    ) {
      return;
    }
    try {
      setClosing(true);
      await closeTicket(id);
    } finally {
      setClosing(false);
    }
  };

  if (isLoading && !currentTicket) return <LoadingSpinner />;

  if (!currentTicket) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          تیکت یافت نشد
        </h1>
        <Button
          className="mx-auto mt-5"
          onClick={() => router.push('/admin/tickets')}
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
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'صندوق تیکت‌ها', href: '/admin/tickets' },
          { label: `تیکت #${currentTicket.id}`, href: `/admin/tickets/${id}` },
        ]}
      />
      <TicketDetailHeader
        ticket={currentTicket}
        backHref="/admin/tickets"
        audienceLabel={currentTicket.type === 'teacher' ? 'مدرس' : 'دانش‌پژوه'}
        actions={
          currentTicket.status !== 'closed' ? (
            <Button
              variant="danger"
              onClick={handleClose}
              loading={closing}
              className="w-full gap-2 sm:w-auto"
            >
              <LockKeyhole className="h-4 w-4" />
              بستن تیکت
            </Button>
          ) : undefined
        }
      />
      <TicketConversation
        messages={currentTicket.messages}
        sendingMessage={sendingMessage}
        onSendMessage={handleSendMessage}
        ticketStatus={currentTicket.status}
        viewerRole="support"
        composerLabel="پاسخ تیم پشتیبانی"
      />
    </div>
  );
}
