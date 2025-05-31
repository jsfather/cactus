import Form from '@/app/ui/teacher/attendances/create-form';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حضور و غیاب', href: '/teacher/attendances' },
          {
            label: 'ساخت حضور و غیاب',
            href: '/teacher/attendances/create',
            active: true,
          },
        ]}
      />
      <Form />
      <Toaster position="top-center" />
    </main>
  );
}
