'use client';

import Form from '@/components/ui/admin/blogs/edit-form';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { getBlog } from '@/lib/api/panel/admin/blogs';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Blog } from '@/lib/api/panel/admin/blogs';
import { Toaster } from 'react-hot-toast';
import { use } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!resolvedParams?.id) {
        notFound();
        return;
      }

      try {
        const data = await getBlog(resolvedParams.id);
        setBlog(data);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [resolvedParams?.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

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
            href: `/admin/blogs/${resolvedParams.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form blog={blog}/>
      <Toaster position="top-center" />
    </main>
  );
}
