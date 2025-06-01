import request from '@/app/lib/api/client';
import { Student } from '@/app/lib/types';

export const getStudents = async () => {
  const response = await request<{data: Student[]} >('admin/students');

  if (!response) {
    throw new Error('خطایی در دریافت لیست دانش پژوهان رخ داده است');
  }

  return response;
};

export const getStudent = async (id: number | string) => {
  const response = await request<{data: Student}>(`admin/students/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت دانش پژوه رخ داده است');
  }

  return response;
};

export const createStudent = async (data: Partial<Student>) => {
  const response = await request<Student>('admin/students', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد دانش پژوه رخ داده است');
  }

  return response;
};

export const updateStudent = async (id: number | string, data: Partial<Student>) => {
  const response = await request<Student>(`admin/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی دانش پژوه رخ داده است');
  }

  return response;
};

export const deleteStudent = async (id: number | string) => {
  const response = await request<Student>(`admin/students/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف دانش پژوه رخ داده است');
  }

  return response;
};

export const getStudentExamPlacement = async (id: number | string) => {
  const response = await request<{data: Student}>(`admin/students/placement-exam/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت دانش پژوه رخ داده است');
  }

  return response;
};
