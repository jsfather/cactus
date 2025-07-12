import request from '@/app/lib/api/client';
import { Term } from '@/app/lib/types';

export const getTerms = async () => {
  const response = await request<{ data: Term[] }>('/api/admin/terms');

  if (!response?.data) {
    throw new Error('خطایی در دریافت لیست ترم‌ها رخ داده است');
  }

  return response.data;
};

export const getTerm = async (id: number | string) => {
  const response = await request<{ data: Term }>(`/api/admin/terms/${id}`);

  if (!response?.data) {
    throw new Error('خطایی در دریافت ترم رخ داده است');
  }

  return response.data;
};

export const createTerm = async (data: Partial<Term>) => {
  const response = await request<{ data: Term; message: string }>('/api/admin/terms', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در ایجاد ترم رخ داده است');
  }

  return response.data;
};

export const updateTerm = async (id: number | string, data: Partial<Term>) => {
  const response = await request<{ data: Term; message: string }>(`/api/admin/terms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در بروزرسانی ترم رخ داده است');
  }

  return response.data;
};

export const deleteTerm = async (id: number | string) => {
  const response = await request<{ message: string }>(`/api/admin/terms/${id}`, {
    method: 'DELETE',
  });

  if (!response?.message) {
    throw new Error('خطایی در حذف ترم رخ داده است');
  }

  return response;
};
