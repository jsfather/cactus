import Form from '@/components/ui/admin/terms/create-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم', href: '/admin/terms' },
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