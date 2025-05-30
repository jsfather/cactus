import Form from '@/app/ui/teacher/reports/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'گزارش ها', href: '/teacher/reports' },
          {
            label: 'ساخت گزارش',
            href: '/teacher/reports/create',
            active: true,
          },
        ]}
      />
      <Form />
      <Toaster position="top-center" />
    </main>
  );
}
