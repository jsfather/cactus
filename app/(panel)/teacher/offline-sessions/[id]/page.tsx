'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import OfflineSessionForm from '@/app/components/teacher/OfflineSessionForm';
import { useOfflineSession } from '@/app/lib/hooks/use-offline-session';

export default function EditOfflineSessionPage() {
  const params = useParams<{ id: string }>();
  const { currentOfflineSession, loading, fetchOfflineSessionById } =
    useOfflineSession();

  useEffect(() => {
    fetchOfflineSessionById(params.id).catch(() => undefined);
  }, [fetchOfflineSessionById, params.id]);

  if (loading && !currentOfflineSession) return <LoadingSpinner />;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کلاس‌های آفلاین', href: '/teacher/offline-sessions' },
          {
            label: 'ویرایش کلاس',
            href: `/teacher/offline-sessions/${params.id}`,
            active: true,
          },
        ]}
      />
      <h1 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
        ویرایش کلاس آفلاین
      </h1>
      {currentOfflineSession ? (
        <OfflineSessionForm session={currentOfflineSession} />
      ) : (
        <p className="mt-8 text-gray-600 dark:text-gray-400">
          کلاس آفلاین یافت نشد.
        </p>
      )}
    </main>
  );
}
