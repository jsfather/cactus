import request from '@/app/lib/api/client';
import { Exam } from '@/app/lib/types';

export const getExams = async () => {
  const response = await request<{ data: Exam[] }>('admin/exams');

  if (!response) {
    throw new Error('خطایی در دریافت لیست آزمون‌ها رخ داده است');
  }

  return response;
};

export const getExam = async (id: number | string) => {
  const response = await request<{ data: Exam }>(`admin/exams/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت آزمون رخ داده است');
  }

  return response;
};

export const createExam = async (data: Partial<Exam>) => {
  const response = await request<{ data: Exam }>('admin/exams', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد آزمون رخ داده است');
  }

  return response;
};

export const updateExam = async (id: number | string, data: Partial<Exam>) => {
  const response = await request<{ data: Exam }>(`admin/exams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی آزمون رخ داده است');
  }

  return response;
};

export const deleteExam = async (id: number | string) => {
  const response = await request<{ data: Exam }>(`admin/exams/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف آزمون رخ داده است');
  }

  return response;
};
