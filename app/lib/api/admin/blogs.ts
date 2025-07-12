import request from '@/app/lib/api/client';
import { Blog } from '@/app/lib/types';

export const getBlogs = async () => {
  const response = await request<{ data: Blog[] }>('/api/admin/blogs');

  if (!response?.data) {
    throw new Error('خطایی در دریافت لیست بلاگ‌ها رخ داده است');
  }

  return response.data;
};

export const getBlog = async (id: number | string) => {
  const response = await request<{ data: Blog }>(`/api/admin/blogs/${id}`);

  if (!response?.data) {
    throw new Error('خطایی در دریافت بلاگ رخ داده است');
  }

  return response.data;
};

export const createBlog = async (data: Partial<Blog>) => {
  const response = await request<{ data: Blog; message: string }>('/api/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در ایجاد بلاگ رخ داده است');
  }

  return response.data;
};

export const updateBlog = async (id: number | string, data: Partial<Blog>) => {
  const response = await request<{ data: Blog; message: string }>(`/api/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در بروزرسانی بلاگ رخ داده است');
  }

  return response.data;
};

export const deleteBlog = async (id: number | string) => {
  const response = await request<{ message: string }>(`/api/admin/blogs/${id}`, {
    method: 'DELETE',
  });

  if (!response?.message) {
    throw new Error('خطایی در حذف بلاگ رخ داده است');
  }

  return response;
};
