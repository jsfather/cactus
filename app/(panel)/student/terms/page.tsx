'use client';

import { useState, useEffect } from 'react';
import Pagination from '@/app/components/Pagination';
import Search from '@/app/components/Search';
import Table from '@/app/components/Table';
import { toast } from 'react-hot-toast';


interface Term {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'completed';
  teacher_name: string;
  students_count: number;
}



export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const columns = [
    {
      header: 'عنوان دوره',
      accessor: 'title',
    },
    {
      header: 'مدرس',
      accessor: 'teacher_name',
    },
    {
      header: 'تاریخ شروع',
      accessor: 'start_date',
      render: (value: string) => new Date(value).toLocaleDateString('fa-IR'),
    },
    {
      header: 'تاریخ پایان',
      accessor: 'end_date',
      render: (value: string) => new Date(value).toLocaleDateString('fa-IR'),
    },
    {
      header: 'وضعیت',
      accessor: 'status',
      render: (value: Term['status']) => {
        const statusClasses = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        };
        const statusText = {
          active: 'در حال برگزاری',
          inactive: 'غیرفعال',
          completed: 'پایان یافته',
        };
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusClasses[value]}`}>
            {statusText[value]}
          </span>
        );
      },
    },
    {
      header: 'تعداد دانشجویان',
      accessor: 'students_count',
    },
  ];

  const fetchTerms = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch(`/api/student/terms?page=${currentPage}&query=${query}`);
      const data = await response.json();
      setTerms(data.terms);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('خطا در دریافت لیست ترم‌ها');
      console.error('Failed to fetch terms:', error);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ترم‌های من</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search
          placeholder="جستجوی ترم"
          className="max-w-lg"
        />
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
