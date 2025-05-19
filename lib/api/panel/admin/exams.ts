import request from '../../httpClient';

export interface Exam {
  id: number;
  title: string;
  description: string;
  date: string | null;
  duration: number | null;
  term_id: number | null;
  created_at: string;
  updated_at: string;
}

export const getExams = () => request<Exam[]>('admin/exams');

export const getExam = (id: number) => request<Exam>(`admin/exams/${id}`);

export const createExam = (data: Partial<Exam>) =>
  request<Exam>('admin/exams', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateExam = (id: number, data: Partial<Exam>) =>
  request<Exam>(`admin/exams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteExam = (id: number) =>
  request<void>(`admin/exams/${id}`, {
    method: 'DELETE',
  });
