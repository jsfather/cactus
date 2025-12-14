'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTicket } from '@/app/lib/hooks/use-ticket';
import { Ticket, Message } from '@/app/lib/types';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Calendar,
  Send,
  X,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const replySchema = z.object({
  message: z.string().min(1, 'پیام نمی‌تواند خالی باشد'),
});

type ReplyFormData = z.infer<typeof replySchema>;

const statusColors = {
  open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

const statusIcons = {
  open: <Clock className="h-4 w-4" />,
  closed: <CheckCircle className="h-4 w-4" />,
  pending: <AlertCircle className="h-4 w-4" />,
};

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    currentTicket,
    isLoading,
    fetchTicketById,
    closeTicket,
    replyToTicket,
    clearCurrentTicket,
  } = useTicket();
  
  const [isReplying, setIsReplying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  useEffect(() => {
    const loadTicket = async () => {
      try {
        await fetchTicketById(resolvedParams.id);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        router.push('/admin/tickets');
      }
    };

    loadTicket();

    return () => {
      clearCurrentTicket();
    };
  }, [resolvedParams.id, fetchTicketById, clearCurrentTicket, router]);

  const handleCloseTicket = async () => {
    if (!currentTicket || currentTicket.status === 'closed') return;

    try {
      await closeTicket(currentTicket.id.toString());
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  const onSubmitReply = async (data: ReplyFormData) => {
    if (!currentTicket) return;

    try {
      await replyToTicket(currentTicket.id.toString(), data);
      reset();
      setIsReplying(false);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        return status;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentTicket) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">تیکت یافت نشد</p>
      </div>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت تیکت‌ها', href: '/admin/tickets' },
          {
            label: `تیکت #${currentTicket.id}`,
            href: `/admin/tickets/${currentTicket.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <Button
                    variant="white"
                    onClick={() => router.push('/admin/tickets')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    بازگشت
                  </Button>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                      statusColors[currentTicket.status] || statusColors.open
                    }`}
                  >
                    {statusIcons[currentTicket.status] || statusIcons.open}
                    {getStatusText(currentTicket.status)}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {currentTicket.subject}
                </h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {currentTicket.student || currentTicket.teacher || 'کاربر نامشخص'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(currentTicket.created_at || new Date().toISOString())}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {currentTicket.messages?.length || 0} پیام
                  </div>
                </div>
                {currentTicket.department && (
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-900 dark:text-blue-300">
                      {currentTicket.department}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {currentTicket.status !== 'closed' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => setIsReplying(!isReplying)}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      پاسخ
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleCloseTicket}
                      loading={isLoading}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      بستن تیکت
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && currentTicket.status !== 'closed' && (
          <div className="mt-6 rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="px-6 py-4">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                ارسال پاسخ
              </h3>
              <form
                onSubmit={handleSubmit(onSubmitReply)}
                className="space-y-4"
              >
                <div>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="پاسخ خود را بنویسید..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="white"
                    onClick={() => {
                      setIsReplying(false);
                      reset();
                    }}
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    ارسال پاسخ
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="mt-6 space-y-4">
          {currentTicket.messages && currentTicket.messages.length > 0 ? (
            currentTicket.messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-lg bg-white shadow dark:bg-gray-800 ${
                  message.is_student ? 'ml-12' : 'mr-12'
                }`}
              >
                <div className="px-6 py-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {message.is_student ? (
                        <User className="h-5 w-5 text-blue-500" />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-green-500" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {message.sender}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.is_student ? '(دانش‌پژوه)' : '(مدیر)'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {message.message}
                    </p>
                  </div>
                  {message.attachment && (
                    <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                      <a
                        href={message.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        <FileText className="h-4 w-4" />
                        فایل ضمیمه
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="px-6 py-8 text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  هنوز هیچ پیامی ارسال نشده است
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
