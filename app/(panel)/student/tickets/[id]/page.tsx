'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  Ticket as TicketIcon,
  MessageSquare,
  Clock,
  User,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Message } from '@/app/lib/types/ticket';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const TicketDetailPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { currentTicket, isLoading, fetchTicketById } = useStudentTicket();

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      if (resolvedParamsData.id) {
        await fetchTicketById(resolvedParamsData.id);
      }
    };

    resolveParams();
  }, [params, fetchTicketById]);

  const breadcrumbItems = [
    { label: 'پنل دانشجو', href: '/student' },
    { label: 'تیکت‌ها', href: '/student/tickets' },
    {
      label: currentTicket?.subject || 'جزئیات تیکت',
      href: `/student/tickets/${resolvedParams?.id}`,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
        return status;
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentTicket) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            تیکت یافت نشد
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            تیکت مورد نظر شما یافت نشد یا ممکن است حذف شده باشد.
          </p>
          <Button onClick={() => router.push('/student/tickets')}>
            بازگشت به لیست تیکت‌ها
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push('/student/tickets')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        </div>
      </div>

      {/* Ticket Header */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <TicketIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTicket.subject}
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="mr-1 h-4 w-4" />
                  ID: {currentTicket.id}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <User className="mr-1 h-4 w-4" />
                  {currentTicket.department}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(currentTicket.status)}`}
            >
              {getStatusText(currentTicket.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <MessageSquare className="mr-2 h-5 w-5" />
          پیام‌ها ({currentTicket.messages?.length || 0})
        </h2>

        {currentTicket.messages && currentTicket.messages.length > 0 ? (
          <div className="space-y-4">
            {currentTicket.messages.map((message: Message, index: number) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${
                  message.is_student
                    ? 'border-r-4 border-blue-400 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                    : 'border-r-4 border-gray-400 bg-gray-50 dark:border-gray-400 dark:bg-gray-800/50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {message.sender}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        message.is_student
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}
                    >
                      {message.is_student ? 'دانشجو' : 'پشتیبانی'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDate(message.created_at)}
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {message.message}
                </div>
                {message.attachment && (
                  <div className="mt-2">
                    <a
                      href={message.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      مشاهده پیوست
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              هیچ پیامی وجود ندارد
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              هنوز پیامی برای این تیکت ثبت نشده است.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailPage;
