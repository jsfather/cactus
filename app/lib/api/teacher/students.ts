import request from '@/app/lib/api/client';
import { Student } from '@/app/lib/types';

export const getStudents = async () => {
  const response = await request<{ data: Student[] }>('teacher/students');

  if (!response) {
    throw new Error('خطایی در دریافت لیست دانش پژوهان رخ داده است');
  }

  return response;
};

export const getStudent = async (id: string) => {
  const response = await request<{ data: Student }>(`teacher/students/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت دانش پژوه رخ داده است');
  }

  return response;
};
