'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, ExternalLink, Plus, Trash2, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useOfflineSession } from '@/app/lib/hooks/use-offline-session';
import type { OfflineSession } from '@/app/lib/types/offline-session';

export default function OfflineSessionsPage() {
  const router = useRouter();
  const {
    offlineSessionList,
    loading,
    error,
    fetchOfflineSessionList,
    deleteOfflineSession,
    clearError,
  } = useOfflineSession();
  const [selected, setSelected] = useState<OfflineSession | null>(null);

  useEffect(() => {
    fetchOfflineSessionList().catch(() => undefined);
  }, [fetchOfflineSessionList]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [clearError, error]);

  const handleDelete = async () => {
    if (!selected) return;

    try {
      await deleteOfflineSession(selected.id.toString());
      toast.success('کلاس آفلاین حذف شد');
      setSelected(null);
    } catch {
      toast.error('حذف کلاس آفلاین انجام نشد');
    }
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدرس', href: '/teacher' },
          {
            label: 'کلاس‌های آفلاین',
            href: '/teacher/offline-sessions',
            active: true,
          },
        ]}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            کلاس‌های آفلاین
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            ویدئوها و محتوای آفلاین ترم‌های خود را مدیریت کنید.
          </p>
        </div>
        <Button
          onClick={() => router.push('/teacher/offline-sessions/new')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          کلاس جدید
        </Button>
      </div>

      {loading && offlineSessionList.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : offlineSessionList.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">
            هنوز کلاس آفلاینی ثبت نشده است
          </h2>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {offlineSessionList.map((session) => (
            <Card key={session.id} className="flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {session.title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    شناسه ترم: {session.term_id}
                  </p>
                </div>
                <Video className="text-primary-600 h-6 w-6" />
              </div>
              <p className="mt-4 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
                {session.description || 'بدون توضیحات'}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={session.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:text-primary-700 inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  مشاهده
                </a>
                <Button
                  variant="white"
                  className="gap-2"
                  onClick={() =>
                    router.push(`/teacher/offline-sessions/${session.id}`)
                  }
                >
                  <Edit className="h-4 w-4" />
                  ویرایش
                </Button>
                <Button
                  variant="danger"
                  className="gap-2"
                  onClick={() => setSelected(session)}
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={handleDelete}
        title="حذف کلاس آفلاین"
        description={`آیا از حذف «${selected?.title || ''}» مطمئن هستید؟`}
        confirmText="حذف"
        loading={loading}
      />
    </main>
  );
}
