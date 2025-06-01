import request from '@/app/lib/api/client';
import { FAQ } from '@/app/lib/types';

export const getFAQs = async () => {
  const response = await request<{ data: FAQ[] }>('admin/faqs');

  if (!response) {
    throw new Error('خطایی در دریافت لیست سوالات متداول رخ داده است');
  }

  return response;
};

export const createFAQ = async (data: Partial<FAQ>) => {
  const response = await request<{ data: FAQ }>('admin/faqs', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد سوال متداول رخ داده است');
  }

  return response;
};

export const updateFAQ = async (id: number | string, data: Partial<FAQ>) => {
  const response = await request<{ data: FAQ }>(`admin/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی سوال متداول رخ داده است');
  }

  return response;
};

export const deleteFAQ = async (id: number | string) => {
  const response = await request<{ message: string }>(`admin/faqs/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف سوال متداول رخ داده است');
  }

  return response;
};
