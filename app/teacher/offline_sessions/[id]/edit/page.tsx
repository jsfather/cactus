'use client';

import Form from '@/components/ui/teacher/offline_sessions/edit-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { getOfflineSession, OfflineSession } from '@/lib/api/panel/teacher/offline_sessions';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { use } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [offlineSession, setOfflineSession] = useState<OfflineSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfflineSession = async () => {
      if (!resolvedParams?.id) {
        notFound();
        return;
      }

      try {
        const data = await getOfflineSession(resolvedParams.id);
        setOfflineSession(data);
      } catch (error) {
        console.error('Failed to fetch offline session:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchOfflineSession();
  }, [resolvedParams?.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!offlineSession) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کلاس های آفلاین', href: '/teacher/offline_sessions' },
          {
            label: 'ویرایش کلاس آفلاین',
            href: `/teacher/offline_sessions/${resolvedParams.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form offlineSession={offlineSession} />
      <Toaster position="top-center" />
    </main>
  );
}
