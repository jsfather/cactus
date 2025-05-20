'use client';

import Form from '@/components/ui/admin/users/edit-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { getUser } from '@/lib/api/panel/admin/users';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/lib/api/panel/admin/users';
import { Toaster } from 'react-hot-toast';
import { use } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!resolvedParams?.id) {
        notFound();
        return;
      }

      try {
        const data = await getUser(resolvedParams.id);
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [resolvedParams?.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کاربران', href: '/admin/users' },
          {
            label: 'ویرایش کاربر',
            href: `/admin/users/${resolvedParams.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form user={user} />
      <Toaster position="top-center" />
    </main>
  );
}
