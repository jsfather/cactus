import request from '@/app/lib/api/client';
import { FAQ } from '@/app/lib/types';

export const getFAQs = async () => {
  const response = await request<{ data: FAQ[] }>('/api/admin/faqs');

  if (!response?.data) {
    throw new Error('خطایی در دریافت لیست سوالات متداول رخ داده است');
  }

  return response.data;
};

export const createFAQ = async (data: Partial<FAQ>) => {
  const response = await request<{ data: FAQ; message: string }>('/api/admin/faqs', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در ایجاد سوال متداول رخ داده است');
  }

  return response.data;
};

export const updateFAQ = async (id: number | string, data: Partial<FAQ>) => {
  const response = await request<{ data: FAQ; message: string }>(`/api/admin/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در بروزرسانی سوال متداول رخ داده است');
  }

  return response.data;
};

export const deleteFAQ = async (id: number | string) => {
  const response = await request<{ message: string }>(`/api/admin/faqs/${id}`, {
    method: 'DELETE',
  });

  if (!response?.message) {
    throw new Error('خطایی در حذف سوال متداول رخ داده است');
  }

  return response;
};
