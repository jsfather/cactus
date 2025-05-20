'use client';

import { CreateExam } from '@/components/ui/admin/exams/buttons';
import ExamsTable from '@/components/ui/admin/exams/table';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'امتحانات', href: '/admin/exams', active: true },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">امتحانات</h1>
        <CreateExam />
      </div>
      <ExamsTable query="" currentPage={1} />
      <Toaster position="top-center" />
    </main>
  );
}
