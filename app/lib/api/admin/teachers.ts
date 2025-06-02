import request from '@/app/lib/api/client';
import { Teacher } from '@/app/lib/types';

export const getTeachers = async () => {
  const response = await request<{ data: Teacher[] }>('admin/teachers');

  if (!response) {
    throw new Error('خطایی در دریافت لیست مدرسین رخ داده است');
  }

  return response;
};

export const getTeacher = async (id: number | string) => {
  const response = await request<{ data: Teacher }>(`admin/teachers/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت مدرس رخ داده است');
  }

  return response;
};

export const createTeacher = async (data: Partial<Teacher>) => {
  const response = await request<{ data: Teacher }>('admin/teachers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد مدرس رخ داده است');
  }

  return response;
};

export const updateTeacher = async (id: number | string, data: Partial<Teacher>) => {
  const response = await request<{ data: Teacher }>(`admin/teachers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی مدرس رخ داده است');
  }

  return response;
};

export const deleteTeacher = async (id: number | string) => {
  const response = await request<{ data: Teacher }>(`admin/teachers/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف مدرس رخ داده است');
  }

  return response;
};
