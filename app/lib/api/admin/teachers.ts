import { ApiService } from '@/app/lib/api/client';
import { Teacher } from '@/app/lib/types';

export const getTeachers = async () => {
  const response = await ApiService.get<{ data: Teacher[] }>('admin/teachers');

  if (!response) {
    throw new Error('خطایی در دریافت لیست مدرسین رخ داده است');
  }

  return response;
};

export const getTeacher = async (id: number | string) => {
  const response = await ApiService.get<{ data: Teacher }>(`admin/teachers/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت مدرس رخ داده است');
  }

  return response;
};

export const createTeacher = async (data: FormData) => {
  const response = await ApiService.post<{ data: Teacher }>('admin/teachers', data);

  if (!response) {
    throw new Error('خطایی در ایجاد مدرس رخ داده است');
  }

  return response;
};

export const updateTeacher = async (
  id: number | string,
  data: FormData
) => {
  const response = await ApiService.put<{ data: Teacher }>(`admin/teachers/${id}`, data);

  if (!response) {
    throw new Error('خطایی در بروزرسانی مدرس رخ داده است');
  }

  return response;
};

export const deleteTeacher = async (id: number | string) => {
  await ApiService.delete(`admin/teachers/${id}`);
  
  // If no error was thrown, the deletion was successful
  return { success: true };
};
