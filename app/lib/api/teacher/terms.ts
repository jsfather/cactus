import request from '@/app/lib/api/client';
import { Term } from '@/app/lib/types';

export const getTerms = async () => {
  const response = await request<{ data: Term[] }>('teacher/terms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست ترم‌ها رخ داده است');
  }

  return response;
};

export const getTerm = async (id: string) => {
  const response = await request<{ data: Term }>(`teacher/terms/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت ترم رخ داده است');
  }

  return response;
};
