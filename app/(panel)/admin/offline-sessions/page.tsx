'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { OfflineSession } from '@/lib/types/offline-session';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminOfflineSession } from '@/app/lib/hooks/use-admin-offline-session';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Pagination from '@/app/components/ui/Pagination';
import {
  Video,
  Plus,
  Calendar,
  FileText,
  TrendingUp,
  PlayCircle,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import { useTerm } from '@/app/lib/hooks/use-term';

export default function OfflineSessionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<OfflineSession | null>(null);
  const {
    offlineSessionList,
    loading,
    fetchOfflineSessionList,
    deleteOfflineSession,
    currentTermId,
    setCurrentTermId,
    paginationMeta,
  } = useAdminOfflineSession();
  const { termList, fetchTermList } = useTerm();

  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  useEffect(() => {
    if (currentTermId) {
      fetchOfflineSessionList(currentTermId, currentPage);
    }
  }, [currentTermId, currentPage, fetchOfflineSessionList]);

  // Calculate summary stats
  const totalSessions = paginationMeta?.total ?? offlineSessionList.length;
  const sessionsWithHomework = offlineSessionList.filter(
    (session) => session.homeworks && session.homeworks.length > 0
  ).length;
  const totalHomeworks = offlineSessionList.reduce(
    (acc, session) => acc + (session.homeworks?.length || 0),
    0
  );
  const thisMonthSessions = offlineSessionList.filter((session) => {
    const sessionDate = new Date(session.created_at);
    const thisMonth = new Date();
    return (
      sessionDate.getMonth() === thisMonth.getMonth() &&
      sessionDate.getFullYear() === thisMonth.getFullYear()
    );
  }).length;

  const columns: Column<OfflineSession>[] = [
    {
      header: 'عنوان',
      accessor: 'title',
    },
    {
      header: 'توضیحات',
      accessor: 'description',
      render: (value): string => {
        return String(value).length > 50
          ? String(value).substring(0, 50) + '...'
          : String(value);
      },
    },
    {
      header: 'لینک ویدیو',
      accessor: 'video_url',
      render: (value): any => {
        const url = String(value);
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 underline"
          >
            <PlayCircle className="h-4 w-4" />
            مشاهده
          </a>
        );
      },
    },
    {
      header: 'تعداد تکالیف',
      accessor: 'homeworks',
      render: (value): string => {
        const homeworks = value as any[];
        return homeworks?.length?.toString() || '0';
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value): any => {
        return <span className="dir-ltr inline-block">{String(value)}</span>;
      },
    },
  ];

  const handleDeleteClick = (session: OfflineSession) => {
    setItemToDelete(session);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteOfflineSession(itemToDelete.id.toString());
      toast.success('جلسه آفلاین با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      if (currentTermId) {
        await fetchOfflineSessionList(currentTermId, currentPage);
      }
    } catch (error) {
      toast.error('خطا در حذف جلسه آفلاین');
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

  if (loading && !offlineSessionList.length) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          {
            label: 'جلسات آفلاین',
            href: '/admin/offline-sessions',
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت جلسات آفلاین
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              ایجاد، ویرایش و مدیریت جلسات آفلاین
            </p>
          </div>
          <Button
            onClick={() => router.push('/admin/offline-sessions/new')}
            disabled={!currentTermId}
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن جلسه جدید
          </Button>
        </div>

        {/* Term Filter */}
        <div className="mt-6">
          <Select
            label="انتخاب ترم"
            value={currentTermId?.toString() || ''}
            onChange={(e) => setCurrentTermId(e.target.value || null)}
            options={[
              { label: 'ترم را انتخاب کنید', value: '' },
              ...termList.map((term) => ({
                label: term.title,
                value: term.id.toString(),
              })),
            ]}
            required
          />
        </div>

        {currentTermId ? (
          <>
            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mr-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                          کل جلسات
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {totalSessions.toLocaleString('fa-IR')}
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
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mr-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                          جلسات با تکلیف
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {sessionsWithHomework.toLocaleString('fa-IR')}
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
                      <Calendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="mr-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                          کل تکالیف
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {totalHomeworks.toLocaleString('fa-IR')}
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
                          این ماه
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {thisMonthSessions.toLocaleString('fa-IR')}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="mt-6">
              <Table
                data={offlineSessionList}
                columns={columns}
                loading={loading}
                emptyMessage="هیچ جلسه آفلاینی یافت نشد"
                onEdit={(session) =>
                  router.push(`/admin/offline-sessions/${session.id}`)
                }
                onDelete={handleDeleteClick}
              />
            </div>

            {/* Pagination */}
            {paginationMeta && paginationMeta.last_page > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination totalPages={paginationMeta.last_page} />
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-lg bg-yellow-50 p-6 text-center dark:bg-yellow-900/20">
            <p className="text-yellow-800 dark:text-yellow-300">
              لطفاً ابتدا یک ترم را انتخاب کنید
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف جلسه آفلاین"
        description={`آیا از حذف جلسه "${itemToDelete?.title}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />
    </main>
  );
}
