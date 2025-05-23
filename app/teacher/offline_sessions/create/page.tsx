import Form from '@/components/ui/teacher/offline_sessions/create-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کلاس های آفلاین', href: '/teacher/offline_sessions' },
          {
            label: 'ساخت کلاس آفلاین',
            href: '/teacher/offline_sessions/create',
            active: true,
          },
        ]}
      />
      <Form />
      <Toaster position="top-center" />
    </main>
  );
}
