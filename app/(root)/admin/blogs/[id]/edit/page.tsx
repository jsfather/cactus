import Form from '@/components/ui/admin/blogs/edit-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { getBlog, getBlogs } from '@/lib/api/panel/admin/blogs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ویرایش بلاگ',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [blog] = await Promise.all([
    getBlog(id),
    getBlogs(),
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'بلاگ', href: '/admin/blogs' },
          {
            label: 'ویرایش بلاگ',
            href: `/admin/blogs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form blog={blog}/>
    </main>
  );
}
