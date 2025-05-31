'use client';

import Form from '@/app/ui/admin/exams/create-form';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'آزمون ها', href: '/admin/exams' },
          {
            label: 'ساخت آزمون',
            href: '/admin/exams/create',
            active: true,
          },
        ]}
      />
      <Form />
      <Toaster position="top-center" />
    </main>
  );
}
