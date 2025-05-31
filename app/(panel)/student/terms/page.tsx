'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/components/ui/Pagination';
import Search from '@/app/components/ui/Search';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTerms } from '@/app/lib/api/student/terms';
import { Term } from '@/app/lib/types';

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

export default function Page() {
  const searchParams = useSearchParams();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams?.get('query') || '';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const columns = [
    {
      header: 'عنوان دوره',
      accessor: 'title' as const,
    },
    {
      header: 'مدت دوره',
      accessor: 'duration' as const,
    },
    {
      header: 'تعداد جلسات',
      accessor: 'number_of_sessions' as const,
    },
    {
      header: 'تاریخ شروع',
      accessor: 'start_date' as const,
      render: (value: string | number, _item: Term) =>
        new Date(value.toString()).toLocaleDateString('fa-IR'),
    },
    {
      header: 'تاریخ پایان',
      accessor: 'end_date' as const,
      render: (value: string | number, _item: Term) =>
        new Date(value.toString()).toLocaleDateString('fa-IR'),
    },
    {
      header: 'نوع دوره',
      accessor: 'type' as const,
      render: (value: string | number, _item: Term) => {
        const typeValue = value as Term['type'];
        const typeClasses = {
          normal:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          capacity_completion:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          vip: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        } as const;
        const typeText = {
          normal: 'عادی',
          capacity_completion: 'تکمیل ظرفیت',
          vip: 'ویژه',
        } as const;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${typeClasses[typeValue]}`}
          >
            {typeText[typeValue]}
          </span>
        );
      },
    },
    {
      header: 'ظرفیت',
      accessor: 'capacity' as const,
    },
  ] satisfies Column<Term>[];

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await getTerms();
      if (response?.data) {
        setTerms(response.data);
        // Since we don't have pagination info from the API yet, we'll set totalPages to 1
        setTotalPages(1);
      }
    } catch (error) {
      toast.error('خطا در دریافت لیست ترم‌ها');
      console.error('Failed to fetch terms:', error);
      setTerms([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, [query, currentPage]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم‌های من
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="جستجوی ترم" className="max-w-lg" />
      </div>
      <Table
        data={terms}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ ترمی یافت نشد"
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
