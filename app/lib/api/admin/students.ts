import { ApiService } from '@/app/lib/api/client';
import { Student } from '@/app/lib/types';

export const getStudents = async () => {
  const response = await ApiService.get<{ data: Student[] }>('admin/students');

  if (!response) {
    throw new Error('خطایی در دریافت لیست دانش‌پژوهان رخ داده است');
  }

  return response;
};

export const getStudent = async (id: number | string) => {
  const response = await ApiService.get<{ data: Student }>(
    `admin/students/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت دانش‌پژوه رخ داده است');
  }

  return response;
};

export const createStudent = async (data: FormData) => {
  const response = await ApiService.post<{ data: Student }>(
    'admin/students',
    data
  );

  if (!response) {
    throw new Error('خطایی در ایجاد دانش‌پژوه رخ داده است');
  }

  return response;
};

export const updateStudent = async (id: number | string, data: FormData) => {
  const response = await ApiService.put<{ data: Student }>(
    `admin/students/${id}`,
    data
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی دانش‌پژوه رخ داده است');
  }

  return response;
};

export const deleteStudent = async (id: number | string) => {
  await ApiService.delete(`admin/students/${id}`);

  // If no error was thrown, the deletion was successful
  return { success: true };
};

export const getStudentExamPlacement = async (id: number | string) => {
  const response = await ApiService.get<{ data: Student }>(
    `admin/students/placement-exam/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت دانش‌پژوه رخ داده است');
  }

  return response;
};
