'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTicket } from '@/app/lib/hooks/use-ticket';
import { Ticket } from '@/app/lib/types';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Table, { Column } from '@/app/components/ui/Table';
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

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      open: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      closed:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    };

    const statusTexts = {
      open: 'باز',
      closed: 'بسته',
      pending: 'در انتظار',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}
      >
        {statusTexts[status as keyof typeof statusTexts]}
      </span>
    );
  };

  const handleViewTicket = (ticket: Ticket) => {
    router.push(`/admin/tickets/${ticket.id}`);
  };

  const columns: Column<Ticket>[] = [
    {
      header: 'موضوع',
      accessor: 'subject',
      render: (value, ticket: Ticket) => (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {ticket.subject}
        </div>
      ),
    },
    {
      header: 'نوع کاربر',
      accessor: 'type',
      render: (value, ticket: Ticket) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {ticket.type === 'teacher' ? (
            <>
              <GraduationCap className="h-4 w-4" />
              مدرس
            </>
          ) : (
            <>
              <User className="h-4 w-4" />
              دانش‌پژوه
            </>
          )}
        </div>
      ),
    },
    {
      header: 'کاربر',
      accessor: 'student',
      render: (value, ticket: Ticket) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {ticket.student || ticket.teacher || 'نامشخص'}
        </div>
      ),
    },
    {
      header: 'بخش',
      accessor: 'department',
      render: (value, ticket: Ticket) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {ticket.department || 'عمومی'}
        </div>
      ),
    },
    {
      header: 'تعداد پیام‌ها',
      accessor: 'messages',
      render: (value, ticket: Ticket) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {ticket.messages?.length || 0} پیام
        </div>
      ),
    },
    {
      header: 'وضعیت',
      accessor: 'status',
      render: (value, ticket: Ticket) => getStatusBadge(ticket.status),
    },
  ];

  if (isListLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت تیکت‌ها', href: '/admin/tickets', active: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            مدیریت تیکت‌ها
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            مدیریت و پاسخگویی به تیکت‌های دانش‌پژوهان و مدرسین
          </p>
        </div>
        <Link href="/admin/tickets/departments">
          <Button variant="white" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            مدیریت دپارتمان‌ها
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-blue-600" />
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

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
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

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mr-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  تیکت‌های دانش‌پژوهان
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {tickets.filter((t) => t.type === 'student').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
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

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            دانش‌پژوهان
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

      {/* Tickets Table */}
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <Table
          data={filteredTickets}
          columns={columns}
          emptyMessage="هیچ تیکتی یافت نشد"
          actions={(ticket: Ticket) => (
            <Button
              variant="primary"
              onClick={() => handleViewTicket(ticket)}
              className="flex items-center gap-1 px-3 py-1 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              مشاهده
            </Button>
          )}
        />
      </div>
    </div>
  );
}
