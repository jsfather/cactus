'use client';

import { use, useEffect, useState } from 'react';
import Form from '@/app/ui/admin/terms/edit-form';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { getTerm } from '@/app/lib/api/admin/terms';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [term, setTerm] = useState<any>(null);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        const data = (await getTerm(resolvedParams.id)).data;
        setTerm(data);
      } catch (error) {
        notFound();
      }
    };

    fetchTerm();
  }, [resolvedParams?.id]);

  if (!term) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم ها', href: '/admin/terms' },
          {
            label: 'ویرایش ترم',
            href: `/admin/terms/${resolvedParams.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form term={term} />
      <Toaster position="top-center" />
    </main>
  );
}
