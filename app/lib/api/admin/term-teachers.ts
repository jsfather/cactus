import request from '@/app/lib/api/client';
import { TermTeacher } from '@/app/lib/types';

export const getTermTeachers = async () => {
  const response = await request<{ data: TermTeacher[] }>('admin/term-teachers');

  if (!response) {
    throw new Error('خطایی در دریافت لیست مدرسین ترم رخ داده است');
  }

  return response;
};

export const getTermTeacher = async (id: number | string) => {
  const response = await request<{ data: TermTeacher }>(`admin/term-teachers/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت مدرس ترم رخ داده است');
  }

  return response;
};

export const createTermTeacher = async (data: Partial<TermTeacher>) => {
  const response = await request<{ data: TermTeacher }>('admin/term-teachers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد مدرس ترم رخ داده است');
  }

  return response;
};

export const updateTermTeacher = async (id: number | string, data: Partial<TermTeacher>) => {
  const response = await request<{ data: TermTeacher }>(`admin/term-teachers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی مدرس ترم رخ داده است');
  }

  return response;
};

export const deleteTermTeacher = async (id: number | string) => {
  const response = await request<{ data: TermTeacher }>(`admin/term-teachers/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف مدرس ترم رخ داده است');
  }

  return response;
};
