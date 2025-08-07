import { ApiService } from '@/app/lib/api/client';
import { TermTeacher } from '@/app/lib/types';

export const getTermTeachers = async () => {
  const response = await ApiService.get<{ data: TermTeacher[] }>(
    'admin/term-teachers'
  );

  if (!response) {
    throw new Error('خطایی در دریافت لیست مدرسین ترم رخ داده است');
  }

  return response;
};

export const getTermTeacher = async (id: number | string) => {
  const response = await ApiService.get<{ data: TermTeacher }>(
    `admin/term-teachers/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت مدرس ترم رخ داده است');
  }

  return response;
};

export const createTermTeacher = async (data: {
  term_id: number;
  teacher_id: number;
  days: Array<{
    day_of_week: string;
    start_time: string;
    end_time: string;
  }>;
}) => {
  const response = await ApiService.post<{ data: TermTeacher }>(
    'admin/term-teachers',
    data
  );

  if (!response) {
    throw new Error('خطایی در ایجاد مدرس ترم رخ داده است');
  }

  return response;
};

export const updateTermTeacher = async (
  id: number | string,
  data: {
    term_id: number;
    teacher_id: number;
    days: Array<{
      day_of_week: string;
      start_time: string;
      end_time: string;
    }>;
  }
) => {
  const response = await ApiService.put<{ data: TermTeacher }>(
    `admin/term-teachers/${id}`,
    data
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی مدرس ترم رخ داده است');
  }

  return response;
};

export const deleteTermTeacher = async (id: number | string) => {
  await ApiService.delete(`admin/term-teachers/${id}`);

  // If no error was thrown, the deletion was successful
  return { success: true };
};
