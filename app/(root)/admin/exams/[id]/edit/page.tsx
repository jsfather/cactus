'use client';

import Form from '@/components/ui/admin/exams/edit-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { getExam } from '@/lib/api/panel/admin/exams';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Exam } from '@/lib/api/panel/admin/exams';
import { Toaster } from 'react-hot-toast';
import { use } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      if (!resolvedParams?.id) {
        notFound();
        return;
      }

      try {
        const data = await getExam(resolvedParams.id);
        setExam(data.data);
      } catch (error) {
        console.error('Failed to fetch exam:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [resolvedParams?.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!exam) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'امتحانات', href: '/admin/exams' },
          {
            label: 'ویرایش امتحان',
            href: `/admin/exams/${resolvedParams.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form exam={exam} />
      <Toaster position="top-center" />
    </main>
  );
}
