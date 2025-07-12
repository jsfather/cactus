import request from '@/app/lib/api/client';
import { Exam } from '@/app/lib/types';

export const getExams = async () => {
  const response = await request<{ data: Exam[] }>('/api/admin/exams');

  if (!response?.data) {
    throw new Error('خطایی در دریافت لیست آزمون‌ها رخ داده است');
  }

  return response.data;
};

export const getExam = async (id: number | string) => {
  const response = await request<{ data: Exam }>(`/api/admin/exams/${id}`);

  if (!response?.data) {
    throw new Error('خطایی در دریافت آزمون رخ داده است');
  }

  return response.data;
};

export const createExam = async (data: Partial<Exam>) => {
  const response = await request<{ data: Exam; message: string }>('/api/admin/exams', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در ایجاد آزمون رخ داده است');
  }

  return response.data;
};

export const updateExam = async (id: number | string, data: Partial<Exam>) => {
  const response = await request<{ data: Exam; message: string }>(`/api/admin/exams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در بروزرسانی آزمون رخ داده است');
  }

  return response.data;
};

export const deleteExam = async (id: number | string) => {
  const response = await request<{ message: string }>(`/api/admin/exams/${id}`, {
    method: 'DELETE',
  });

  if (!response?.message) {
    throw new Error('خطایی در حذف آزمون رخ داده است');
  }

  return response;
};
