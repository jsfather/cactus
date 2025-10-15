'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { OfflineSession } from '@/app/lib/types/offline-session';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useOfflineSession } from '@/app/lib/hooks/use-offline-session';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import {
  Video,
  Plus,
  Calendar,
  BookOpen,
  TrendingUp,
  PlayCircle,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function OfflineSessionsPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<OfflineSession | null>(null);
  const {
    offlineSessionList,
    loading,
    fetchOfflineSessionList,
    deleteOfflineSession,
  } = useOfflineSession();

  useEffect(() => {
    fetchOfflineSessionList();
  }, [fetchOfflineSessionList]);

  // Calculate summary stats
  const totalSessions = offlineSessionList.length;
  const sessionsWithHomeworks = offlineSessionList.filter(
    (session) => session.homeworks && session.homeworks.length > 0
  ).length;
  const totalHomeworks = offlineSessionList.reduce(
    (total, session) =>
      total + (session.homeworks ? session.homeworks.length : 0),
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
      header: 'ویدیو',
      accessor: 'video_url',
      render: (value): any => {
        const videoUrl = value as string;
        if (!videoUrl) return '-';
        return (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <PlayCircle className="ml-1 h-4 w-4" />
            مشاهده ویدیو
          </a>
        );
      },
    },
    {
      header: 'شناسه ترم',
      accessor: 'term_id',
      render: (value): string => {
        return String(value);
      },
    },
    {
      header: 'تعداد تمرینات',
      accessor: 'homeworks',
      render: (value): string => {
        const homeworks = value as any[];
        return homeworks ? homeworks.length.toString() : '0';
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '';
        return new Date(value).toLocaleDateString('fa-IR');
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
      await fetchOfflineSessionList();
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/teacher' },
          {
            label: 'جلسات آفلاین',
            href: '/teacher/offline_sessions',
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
          <Button onClick={() => router.push('/teacher/offline_sessions/new')}>
            <Plus className="ml-2 h-4 w-4" />
            افزودن جلسه جدید
          </Button>
        </div>

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
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      جلسات با تمرین
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {sessionsWithHomeworks.toLocaleString('fa-IR')}
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
                      کل تمرینات
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

        {/* Offline Sessions Table */}
        <div className="mt-6">
          <Table
            data={offlineSessionList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ جلسه آفلاینی یافت نشد"
            onEdit={(session) =>
              router.push(`/teacher/offline_sessions/${session.id}`)
            }
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف جلسه آفلاین"
        description={`آیا از حذف جلسه آفلاین "${itemToDelete?.title}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />
    </main>
  );
}
