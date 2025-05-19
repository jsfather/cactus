'use client';

import { useEffect, useState } from 'react';
import {
  getBlogs,
  Blog,
  createBlog,
  deleteBlog,
  updateBlog,
} from '@/lib/api/panel/admin/blogs';
import DataTable from '@/components/ui/DataTable';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);


  const columns = [
    { key: 'title', label: 'عنوان' },
    { key: 'little_description', label: 'عنوان کوتاه' }
  ]

  useEffect(() => {
    getBlogs()
      .then(setBlogs)
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">بلاگ</h1>
      <DataTable
        columns={columns}
        data={blogs}
        onEdit={updateBlog}
        onDelete={deleteBlog}
      />
    </div>
  );
}
