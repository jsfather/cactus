import request from '@/app/lib/api/client';
import { Homework } from '@/app/lib/types';

export const getHomeworks = async () => {
  const response = await request<{ data: Homework[] }>('student/homeworks');

  if (!response) {
    throw new Error('خطایی در دریافت لیست تکالیف رخ داده است');
  }

  return response;
};

export const getHomework = async (id: string) => {
  const response = await request<{ data: Homework }>(`student/homeworks/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت اطلاعات تکلیف رخ داده است');
  }

  return response;
};

export const submitHomework = async (id: string, data: Partial<Homework>) => {
  const response = await request<{ data: Homework }>(
    `student/homeworks/${id}/submit`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  if (!response) {
    throw new Error('خطایی در ارسال تکلیف رخ داده است');
  }

  return response;
};
