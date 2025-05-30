import request from '@/app/lib/api/client';
import { Term } from '@/app/lib/types';

export const getTerms = async () => {
  const response = await request<{ data: Term[] }>('student/terms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست ترم ها رخ داده است');
  }

  return response;
};

export const getTerm = async (id: string) => {
  const response = await request<Term>(`student/terms/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت اطلاعات ترم رخ داده است');
  }

  return response;
};
