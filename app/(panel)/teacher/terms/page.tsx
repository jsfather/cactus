'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTerms } from '@/app/lib/api/teacher/terms';
import { Term } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<Term>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'مدت زمان',
      accessor: 'duration',
    },
    {
      header: 'تعداد جلسات',
      accessor: 'number_of_sessions',
    },
    {
      header: 'تاریخ شروع',
      accessor: 'start_date',
      render: (value) => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
    {
      header: 'تاریخ پایان',
      accessor: 'end_date',
      render: (value) => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
    {
      header: 'نوع',
      accessor: 'type',
    },
    {
      header: 'ظرفیت',
      accessor: 'capacity',
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value) => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
  ];

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await getTerms();
      if (response) {
        setTerms(response.data);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست ترم ها');
      setTerms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم ها
        </h1>
        <Button onClick={() => router.push('/teacher/terms/new')}>
          ایجاد ترم
        </Button>
      </div>
      <Table
        data={terms}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ ترمی یافت نشد"
        onEdit={(report) => router.push(`/teacher/terms/${report.id}`)}
      />
    </div>
  );
}
