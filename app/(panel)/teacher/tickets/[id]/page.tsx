'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTeacherTicket } from '@/app/lib/hooks/use-teacher-ticket';
import { Card } from '@/app/components/ui/Card';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import TicketConversation from '@/app/components/ui/TicketConversation';
import {
  MessageCircle,
  User,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function TeacherTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const {
    currentTicket,
    loading,
    error,
    fetchTicketById,
    replyToTicket,
    clearError,
  } = useTeacherTicket();

  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketById(ticketId);
    }
  }, [ticketId, fetchTicketById]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSendMessage = async (message: string): Promise<boolean> => {
    if (!ticketId) return false;

    try {
      setSendingMessage(true);
      await replyToTicket(ticketId, { message });
      toast.success('پیام با موفقیت ارسال شد');
      return true;
    } catch (error: any) {
      toast.error(error?.message || 'خطا در ارسال پیام');
      return false;
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'closed':
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'باز';
      case 'closed':
        return 'بسته';
      case 'pending':
        return 'در انتظار';
      default:
        return 'نامشخص';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  const breadcrumbItems = [
    { label: 'پنل مدرس', href: '/teacher' },
    { label: 'تیکت‌ها', href: '/teacher/tickets' },
    {
      label: currentTicket?.subject || 'جزئیات تیکت',
      href: `/teacher/tickets/${ticketId}`,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            تیکت یافت نشد
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            تیکت مورد نظر شما یافت نشد یا امکان دسترسی به آن وجود ندارد.
          </p>
          <button
            onClick={() => router.push('/teacher/tickets')}
            className="text-blue-600 hover:text-blue-500"
          >
            بازگشت به لیست تیکت‌ها
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      {/* Ticket Header */}
      <Card className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentTicket.subject}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>شماره تیکت: #{currentTicket.id}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(currentTicket.status)}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(currentTicket.status)}`}
            >
              {getStatusText(currentTicket.status)}
            </span>
          </div>
        </div>

        {/* Ticket Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                دانش‌آموز
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {currentTicket.student || 'نامشخص'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">بخش</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {currentTicket.department || 'عمومی'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تعداد پیام‌ها
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {currentTicket.messages?.length || 0} پیام
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Conversation */}
      <TicketConversation
        messages={currentTicket.messages}
        loading={false}
        sendingMessage={sendingMessage}
        onSendMessage={handleSendMessage}
        ticketStatus={currentTicket.status}
      />
    </div>
  );
}
