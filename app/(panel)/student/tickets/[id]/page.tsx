'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Building,
  MessageSquare,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

const statusIcons: Record<string, React.ReactElement> = {
  open: <Clock className="h-5 w-5" />,
  closed: <CheckCircle className="h-5 w-5" />,
  pending: <AlertCircle className="h-5 w-5" />,
};

const statusTranslations: Record<string, string> = {
  open: 'باز',
  closed: 'بسته',
  pending: 'در انتظار',
};

const departmentTranslations: Record<string, string> = {
  technical: 'فنی',
  educational: 'آموزشی',
  financial: 'مالی',
  support: 'پشتیبانی',
  other: 'سایر',
};

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const {
    currentTicket: ticket,
    isDetailLoading,
    fetchTicket,
    error,
  } = useStudentTicket();

  useEffect(() => {
    if (ticketId) {
      fetchTicket(ticketId);
    }
  }, [ticketId, fetchTicket]);

  const breadcrumbItems = [
    { label: 'پنل دانش‌آموز', href: '/student' },
    { label: 'تیکت‌ها', href: '/student/tickets' },
    {
      label: ticket?.subject || 'جزئیات تیکت',
      href: `/student/tickets/${ticketId}`,
      active: true,
    },
  ];

  const handleBack = () => {
    router.push('/student/tickets');
  };

  if (isDetailLoading) {
    return <LoadingSpinner />;
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
        <div className="bg-white shadow sm:rounded-lg dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                تیکت یافت نشد
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                تیکت مورد نظر شما یافت نشد
              </p>
              <div className="mt-6">
                <Button onClick={handleBack}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  بازگشت به لیست تیکت‌ها
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            جزئیات تیکت
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            مشاهده جزئیات و وضعیت تیکت پشتیبانی
          </p>
        </div>
        <Button variant="secondary" onClick={handleBack}>
          <ArrowRight className="mr-2 h-4 w-4" />
          بازگشت
        </Button>
      </div>

      {/* Ticket Info */}
      <div className="bg-white shadow sm:rounded-lg dark:bg-gray-800">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Status and Subject */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {ticket.subject}
                </h2>
                <div className="mt-2 flex items-center space-x-4 space-x-reverse">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      statusColors[ticket.status]
                    }`}
                  >
                    {statusIcons[ticket.status]}
                    <span className="mr-2">
                      {statusTranslations[ticket.status] || ticket.status}
                    </span>
                  </span>
                  {ticket.created_at && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="ml-1 h-4 w-4" />
                      تاریخ ایجاد:{' '}
                      {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    بخش
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {departmentTranslations[ticket.department || ''] ||
                      ticket.department ||
                      '-'}
                  </dd>
                </div>
              </div>

              {ticket.teacher && (
                <div className="flex items-center space-x-3 space-x-reverse">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      مدرس
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {ticket.teacher}
                    </dd>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                توضیحات
              </h3>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {ticket.description || 'توضیحاتی ارائه نشده است.'}
                </p>
              </div>
            </div>

            {/* Response Section */}
            {ticket.response && (
              <div>
                <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                  پاسخ پشتیبانی
                </h3>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {ticket.response}
                  </p>
                  {ticket.updated_at && (
                    <div className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <Calendar className="ml-1 h-4 w-4" />
                      تاریخ پاسخ:{' '}
                      {new Date(ticket.updated_at).toLocaleDateString('fa-IR')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
