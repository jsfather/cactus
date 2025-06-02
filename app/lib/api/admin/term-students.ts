import request from '@/app/lib/api/client';
import { TermStudent } from '@/app/lib/types';

export const getTermStudents = async () => {
  const response = await request<{ data: TermStudent[] }>('admin/term-students');

  if (!response) {
    throw new Error('خطایی در دریافت لیست دانش پژوهان ترم رخ داده است');
  }

  return response;
};

export const getTermStudent = async (id: number | string) => {
  const response = await request<{ data: TermStudent }>(`admin/term-students/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت دانش پژوه ترم رخ داده است');
  }

  return response;
};

export const createTermStudent = async (data: Partial<TermStudent>) => {
  const response = await request<{ data: TermStudent }>('admin/term-students', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد دانش پژوه ترم رخ داده است');
  }

  return response;
};

export const updateTermStudent = async (id: number | string, data: Partial<TermStudent>) => {
  const response = await request<{ data: TermStudent }>(`admin/term-students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی دانش پژوه ترم رخ داده است');
  }

  return response;
};

export const deleteTermStudent = async (id: number | string) => {
  const response = await request<{ data: TermStudent }>(`admin/term-students/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف دانش پژوه ترم رخ داده است');
  }

  return response;
}; 