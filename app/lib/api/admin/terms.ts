import request from '@/app/lib/api/client';
import { Term } from '@/app/lib/types';

export const getTerms = async () => {
  const response = await request<{ data: Term[] }>('admin/terms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست ترم‌ها رخ داده است');
  }

  return response;
};

export const getTerm = async (id: number | string) => {
  const response = await request<{ data: Term }>(`admin/terms/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت ترم رخ داده است');
  }

  return response;
};

export const createTerm = async (data: Partial<Term>) => {
  const response = await request<Term>('admin/terms', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد ترم رخ داده است');
  }

  return response;
};

export const updateTerm = async (id: number | string, data: Partial<Term>) => {
  const response = await request<Term>(`admin/terms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی ترم رخ داده است');
  }

  return response;
};

export const deleteTerm = async (id: number | string) => {
  const response = await request<Term>(`admin/terms/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف ترم رخ داده است');
  }

  return response;
};
