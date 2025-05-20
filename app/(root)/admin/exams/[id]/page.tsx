'use client';

import { getExam } from '@/lib/api/panel/admin/exams';
import EditExamForm from '@/components/ui/admin/exams/edit-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default async function Page({ params }: { params: { id: string } }) {
  const exam = await getExam(params.id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'امتحانات', href: '/admin/exams' },
          {
            label: 'ویرایش امتحان',
            href: `/admin/exams/${params.id}`,
            active: true,
          },
        ]}
      />
      <EditExamForm exam={exam} />
      <Toaster position="top-center" />
    </main>
  );
}
