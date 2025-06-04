'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTickets } from '@/app/lib/api/teacher/tickets';
import { Ticket } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<Ticket>[] = [
    {
      header: 'موضوع',
      accessor: 'subject',
    },
    {
      header: 'وضعیت',
      accessor: 'status',
    },
    {
      header: 'بخش',
      accessor: 'department',
    },
  ];

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getTickets();
      if (response) {
        setTickets(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست تیکت ها');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تیکت ها
        </h1>
        <Button onClick={() => router.push('/teacher/tickets/new')}>
          ایجاد تیکت
        </Button>
      </div>
      <Table
        data={tickets}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ تیکتی یافت نشد"
        onEdit={(ticket) => router.push(`/teacher/tickets/${ticket.id}`)}
      />
    </div>
  );
}
