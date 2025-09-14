'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { FAQ } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useFAQ } from '@/app/lib/hooks/use-faq';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { HelpCircle, Plus, Calendar, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function FAQsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FAQ | null>(null);
  const {
    faqList,
    loading,
    fetchFAQList,
    deleteFAQ,
  } = useFAQ();

  useEffect(() => {
    fetchFAQList();
  }, [fetchFAQList]);

  // Calculate summary stats
  const totalFAQs = faqList.length;
  const thisMonthFAQs = faqList.filter(faq => {
    const faqDate = new Date(faq.created_at);
    const thisMonth = new Date();
    return faqDate.getMonth() === thisMonth.getMonth() && 
           faqDate.getFullYear() === thisMonth.getFullYear();
  }).length;
  const thisWeekFAQs = faqList.filter(faq => {
    const faqDate = new Date(faq.created_at);
    const thisWeek = new Date();
    const oneWeekAgo = new Date(thisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    return faqDate >= oneWeekAgo;
  }).length;

  const columns: Column<FAQ>[] = [
    {
      header: 'سوال',
      accessor: 'question',
      render: (value): string => {
        return String(value).length > 80 
          ? String(value).substring(0, 80) + '...'
          : String(value);
      },
    },
    {
      header: 'پاسخ',
      accessor: 'answer',
      render: (value): string => {
        return String(value).length > 100 
          ? String(value).substring(0, 100) + '...'
          : String(value);
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value): string => {
        if (!value) return '';
        return new Date(String(value)).toLocaleDateString('fa-IR');
      },
    },
  ];

  const handleDeleteClick = (faq: FAQ) => {
    setItemToDelete(faq);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteFAQ(itemToDelete.id.toString());
      toast.success('سوال متداول با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchFAQList();
    } catch (error) {
      toast.error('خطا در حذف سوال متداول');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setItemToDelete(null);
    }, 500);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت سوالات متداول', href: '/admin/faqs', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت سوالات متداول
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              ایجاد، ویرایش و مدیریت سوالات متداول
            </p>
          </div>
          <Button onClick={() => router.push('/admin/faqs/new')}>
            <Plus className="h-4 w-4 ml-2" />
            افزودن سوال جدید
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل سوالات
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalFAQs.toLocaleString('fa-IR')}
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
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      این ماه
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {thisMonthFAQs.toLocaleString('fa-IR')}
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
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      این هفته
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {thisWeekFAQs.toLocaleString('fa-IR')}
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
                  <HelpCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      میانگین روزانه
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {Math.round(totalFAQs / 30).toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Table */}
        <div className="mt-6">
          <Table
            data={faqList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ سوال متداولی یافت نشد"
            onEdit={(faq) => router.push(`/admin/faqs/${faq.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف سوال متداول"
        description={`آیا از حذف این سوال متداول مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />
    </main>
  );
}
