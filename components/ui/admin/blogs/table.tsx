'use client';

import { UpdateBlog, DeleteBlog } from '@/components/ui/admin/blogs/buttons';
import { Blog, getBlogs } from '@/lib/api/panel/admin/blogs';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function InvoicesTable({}: {
  query: string;
  currentPage: number;
}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error('خطا در دریافت لیست بلاگ‌ها');
      console.error('Failed to fetch blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {blogs?.map((blog) => (
              <div
                key={blog.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">{blog.title}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {blog.little_description}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateBlog id={blog.id} />
                    <DeleteBlog id={blog.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-right text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  عنوان
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  توضیحات کوتاه
                </th>
                <th scope="col" className="relative py-3 pr-3 pl-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {blogs?.map((blog) => (
                <tr
                  key={blog.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <p>{blog.title}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {blog.little_description}
                  </td>
                  <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                    <div className="flex justify-end gap-3">
                      <UpdateBlog id={blog.id} />
                      <DeleteBlog id={blog.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
