'use client';

import { useState, useEffect } from 'react';
import Table from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { PanelGuide } from '@/app/lib/types';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { usePanelGuide } from '@/app/lib/hooks/use-panel-guide';

export default function Page() {
  const router = useRouter();
  const {
    panelGuides,
    isListLoading: loading,
    fetchPanelGuides,
    deletePanelGuide,
    error,
  } = usePanelGuide();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PanelGuide | null>(null);

  const columns = [
    {
      header: 'عنوان',
      accessor: 'title' as keyof PanelGuide,
    },
    {
      header: 'نوع',
      accessor: 'type' as keyof PanelGuide,
      render: (value: string | number | null) => {
        const typeMap = {
          student: 'دانش پژوه',
          admin: 'مدیر',
          teacher: 'مدرس',
        };
        return typeMap[value as keyof typeof typeMap] || value;
      },
    },
    {
      header: 'توضیحات',
      accessor: 'description' as keyof PanelGuide,
      render: (value: string | number | null) =>
        value
          ? String(value).substring(0, 100) +
            (String(value).length > 100 ? '...' : '')
          : '-',
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at' as keyof PanelGuide,
      render: (value: string | number | null) =>
        value ? new Date(value).toLocaleDateString('fa-IR') : '',
    },
  ];

  const handleDeleteClick = (panelGuide: PanelGuide) => {
    setItemToDelete(panelGuide);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deletePanelGuide(itemToDelete.id.toString());
      toast.success('راهنمای پنل با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('خطا در حذف راهنمای پنل');
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

  useEffect(() => {
    fetchPanelGuides();
  }, [fetchPanelGuides]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'راهنماهای پنل', href: '/admin/panel-guides', active: true },
        ]}
      />

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    کل راهنماها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {panelGuides.length}
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
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    راهنمای دانش پژوه
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      panelGuides.filter((guide) => guide.type === 'student')
                        .length
                    }
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
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-6 4h6"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    راهنمای مدرس
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      panelGuides.filter((guide) => guide.type === 'teacher')
                        .length
                    }
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
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    راهنمای مدیر
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {
                      panelGuides.filter((guide) => guide.type === 'admin')
                        .length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          راهنماهای پنل
        </h1>
        <Button onClick={() => router.push('/admin/panel-guides/new')}>
          ایجاد راهنمای پنل
        </Button>
      </div>

      <div className="mt-8">
        <Table
          data={panelGuides}
          columns={columns}
          loading={loading}
          emptyMessage="هیچ راهنمای پنلی یافت نشد"
          onEdit={(panelGuide) =>
            router.push(`/admin/panel-guides/${panelGuide.id}`)
          }
          onDelete={handleDeleteClick}
        />
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف راهنمای پنل"
        description={`آیا از حذف راهنمای پنل "${itemToDelete?.title}" اطمینان دارید؟`}
        confirmText="حذف"
        loading={deleteLoading}
        variant="danger"
      />
    </main>
  );
}
