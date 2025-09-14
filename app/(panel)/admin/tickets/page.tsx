'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTicket } from '@/app/lib/hooks/use-ticket';
import { Ticket } from '@/app/lib/types';
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
  Filter,
  Eye,
  Building2,
} from 'lucide-react';

type TicketType = 'all' | 'students' | 'teachers';

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

const priorityColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  medium:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusIcons: Record<string, React.ReactElement> = {
  open: <Clock className="h-4 w-4" />,
  closed: <CheckCircle className="h-4 w-4" />,
  pending: <AlertCircle className="h-4 w-4" />,
};

export default function TicketsPage() {
  const router = useRouter();
  const {
    tickets,
    isListLoading,
    fetchTickets,
    fetchTeacherTickets,
    fetchAllTickets,
  } = useTicket();
  
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [ticketType, setTicketType] = useState<TicketType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        if (ticketType === 'all') {
          await fetchAllTickets();
        } else if (ticketType === 'students') {
          await fetchTickets();
        } else {
          await fetchTeacherTickets();
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    loadTickets();
  }, [ticketType, fetchTickets, fetchTeacherTickets, fetchAllTickets]);

  useEffect(() => {
    let filtered = tickets;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTicketTypeIcon = (type?: string) => {
    return type === 'teacher' ? (
      <GraduationCap className="h-4 w-4" />
    ) : (
      <User className="h-4 w-4" />
    );
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

  if (isListLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت تیکت‌ها', href: '/admin/tickets', active: true },
        ]}
      />

      <div className="mt-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت تیکت‌ها
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              مدیریت و پاسخگویی به تیکت‌های دانش‌آموزان و مدرسین
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/admin/tickets/departments">
              <Button variant="white" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                مدیریت دپارتمان‌ها
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل تیکت‌ها
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {tickets.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      تیکت‌های باز
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {tickets.filter((t) => t.status === 'open').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      تیکت‌های دانش‌آموزان
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {tickets.filter((t) => t.type === 'student').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      تیکت‌های مدرسین
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {tickets.filter((t) => t.type === 'teacher').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex gap-2">
            <Button
              variant={ticketType === 'all' ? 'primary' : 'white'}
              onClick={() => setTicketType('all')}
              className="text-sm"
            >
              همه تیکت‌ها
            </Button>
            <Button
              variant={ticketType === 'students' ? 'primary' : 'white'}
              onClick={() => setTicketType('students')}
              className="flex items-center gap-2 text-sm"
            >
              <User className="h-4 w-4" />
              دانش‌آموزان
            </Button>
            <Button
              variant={ticketType === 'teachers' ? 'primary' : 'white'}
              onClick={() => setTicketType('teachers')}
              className="flex items-center gap-2 text-sm"
            >
              <GraduationCap className="h-4 w-4" />
              مدرسین
            </Button>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="open">باز</option>
              <option value="closed">بسته</option>
              <option value="pending">در انتظار</option>
            </select>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">
                هیچ تیکتی یافت نشد
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTicketTypeIcon(ticket.type)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {ticket.type === 'teacher' ? 'مدرس' : 'دانش‌آموز'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        statusColors[ticket.status] || statusColors.open
                      }`}
                    >
                      {statusIcons[ticket.status] || statusIcons.open}
                      {getStatusText(ticket.status)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                    {ticket.subject}
                  </h3>
                  {ticket.department && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                      {ticket.department}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(ticket.created_at || new Date().toISOString())}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {ticket.messages?.length || 0} پیام
                  </div>
                </div>

                <div className="mt-4 text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {ticket.student || ticket.teacher || 'کاربر نامشخص'}
                  </span>
                </div>

                <div className="absolute top-4 left-4">
                  <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
