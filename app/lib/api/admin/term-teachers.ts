import request from '@/app/lib/api/client';
import { TermTeacher } from '@/app/lib/types';

export const getTermTeacher = async (id: number | string) => {
  const response = await request<{ data: TermTeacher }>(`admin/term-teachers/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت ترم مدرس رخ داده است');
  }

  return response;
};

export const createTeacher = async (data: Partial<TermTeacher>) => {
  const response = await request<TermTeacher>('admin/term-teachers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد ترم مدرس رخ داده است');
  }

  return response;
};

export const deleteTeacher = async (id: number | string) => {
  const response = await request<TermTeacher>(`admin/term-teachers/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف ترم مدرس رخ داده است');
  }

  return response;
};
