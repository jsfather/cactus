import Form from '@/app/ui/admin/users/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کاربران', href: '/admin/users' },
          {
            label: 'ساخت کاربر',
            href: '/admin/users/create',
            active: true,
          },
        ]}
      />
      <Form />
      <Toaster position="top-center" />
    </main>
  );
}
