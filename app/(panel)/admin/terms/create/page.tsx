import Form from '@/app/ui/admin/terms/create-form';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم ها', href: '/admin/terms' },
          {
            label: 'ساخت ترم',
            href: '/admin/terms/create',
            active: true,
          },
        ]}
      />
      <Form />
      <Toaster position="top-center" />
    </main>
  );
}
