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

export const getExams = async () => {
  const response = await request<{ data: Exam[] }>('admin/exams');

  if (!response) {
    throw new Error('خطایی در دریافت لیست آزمون ها رخ داده است');
  }

  return response;
};

export const getExam = async (id: string) => {
  const response = await request<{ data: Exam }>(`admin/exams/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت اطلاعات آزمون رخ داده است');
  }

  return response;
};

export const createExam = async (data: Partial<Exam>) => {
  const response = await request<Exam>('admin/exams', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد آزمون رخ داده است');
  }

  return response;
};

export const updateExam = async (id: string, data: Partial<Exam>) => {
  const response = await request<Exam>(`admin/exams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی آزمون رخ داده است');
  }

  return response;
};

export const deleteExam = async (id: string) => {
  const response = await request<Exam>(`admin/exams/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف آزمون رخ داده است');
  }

  return response;
};
