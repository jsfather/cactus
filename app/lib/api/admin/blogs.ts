import request from '@/app/lib/api/client';
import { Blog } from '@/app/lib/types';

export const getBlogs = async () => {
  const response = await request<Blog[]>('admin/blogs');

  if (!response) {
    throw new Error('خطایی در دریافت لیست بلاگ‌ها رخ داده است');
  }

  return response;
};

export const getBlog = async (id: string) => {
  const response = await request<Blog>(`admin/blogs/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت بلاگ رخ داده است');
  }

  return response;
};

export const createBlog = async (data: Partial<Blog>) => {
  const response = await request<Blog>('admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد بلاگ رخ داده است');
  }

  return response;
};

export const updateBlog = async (id: string, data: Partial<Blog>) => {
  const response = await request<Blog>(`admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی بلاگ رخ داده است');
  }

  return response;
};

export const deleteBlog = async (id: string) => {
  const response = await request<Blog>(`admin/blogs/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف بلاگ رخ داده است');
  }

  return response;
};
