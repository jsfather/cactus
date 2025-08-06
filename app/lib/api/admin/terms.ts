'use client';

import { ApiService } from '@/app/lib/api/client';
import { Term } from '@/app/lib/types';

export const getTerms = async () => {
  const response = await ApiService.get<{ data: Term[] }>('admin/terms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست ترم‌ها رخ داده است');
  }

  return response;
};

export const getTerm = async (id: number | string) => {
  const response = await ApiService.get<{ data: Term }>(`admin/terms/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت ترم رخ داده است');
  }

  return response;
};

export const createTerm = async (data: Partial<Term>) => {
  const response = await ApiService.post<Term>('admin/terms', data);

  if (!response) {
    throw new Error('خطایی در ایجاد ترم رخ داده است');
  }

  return response;
};

export const updateTerm = async (id: number | string, data: Partial<Term>) => {
  const response = await ApiService.put<Term>(`admin/terms/${id}`, data);

  if (!response) {
    throw new Error('خطایی در بروزرسانی ترم رخ داده است');
  }

  return response;
};

export const deleteTerm = async (id: number | string) => {
  const response = await ApiService.delete<Term>(`admin/terms/${id}`);

  if (!response) {
    throw new Error('خطایی در حذف ترم رخ داده است');
  }

  return response;
};
