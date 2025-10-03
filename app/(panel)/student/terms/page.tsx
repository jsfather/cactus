'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { getTerms } from '@/app/lib/api/student/terms';
import { Term } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

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

  const handleView = (term: Term) => {
    router.push(`/student/terms/${term.id}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ترم ها
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          لیست ترم های آموزشی موجود
        </p>
      </div>
      <Table
        data={terms}
        columns={columns}
        loading={loading}
        emptyMessage="هیچ ترمی یافت نشد"
        actions={(term) => (
          <button
            onClick={() => handleView(term)}
            className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            title="مشاهده جزئیات"
          >
            <Eye className="h-3 w-3" />
            مشاهده
          </button>
        )}
      />
    </div>
  );
}
