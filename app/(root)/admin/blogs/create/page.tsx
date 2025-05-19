import Form from '@/components/ui/admin/blogs/create-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ساخت بلاگ',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'بلاگ', href: '/admin/blogs' },
          {
            label: 'ساخت بلاگ',
            href: '/admin/blogs/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
