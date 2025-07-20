import request from '@/app/lib/api/client';
import { Exam } from '@/app/lib/types';
import { PlacementExamQuestion } from '@/app/lib/types/placement-exam';

export const getExams = async () => {
  const response = await request<{ data: Exam[] }>('admin/exams');

  if (!response) {
    throw new Error('خطایی در دریافت لیست آزمون‌ها رخ داده است');
  }

  return response;
};

export const getExam = async (id: number | string) => {
  const response = await request<{ data: Exam }>(`admin/exams/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت آزمون رخ داده است');
  }

  return response;
};

export const createExam = async (data: Partial<Exam>) => {
  const response = await request<{ data: Exam }>('admin/exams', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد آزمون رخ داده است');
  }

  return response;
};

export const updateExam = async (id: number | string, data: Partial<Exam>) => {
  const response = await request<{ data: Exam }>(`admin/exams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی آزمون رخ داده است');
  }

  return response;
};

export const deleteExam = async (id: number | string) => {
  const response = await request<{ data: Exam }>(`admin/exams/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف آزمون رخ داده است');
  }

  return response;
};

// Question management functions
export const createExamQuestion = async (
  examId: number | string,
  data: {
    text: string;
    options: Array<{
      text: string;
      is_correct: number;
    }>;
    file?: File;
  }
) => {
  const formData = new FormData();
  formData.append('text', data.text);
  formData.append('options', JSON.stringify(data.options));

  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await request<{ data: PlacementExamQuestion }>(
    `admin/exams/${examId}/questions`,
    {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    }
  );

  if (!response) {
    throw new Error('خطایی در ایجاد سوال رخ داده است');
  }

  return response;
};

export const updateExamQuestion = async (
  examId: number | string,
  questionId: number | string,
  data: {
    text: string;
    options: Array<{
      id?: number | string;
      text: string;
      is_correct: number;
    }>;
    file?: File;
  }
) => {
  const formData = new FormData();
  formData.append('text', data.text);
  formData.append('options', JSON.stringify(data.options));

  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await request<{ data: PlacementExamQuestion }>(
    `admin/exams/${examId}/questions/${questionId}`,
    {
      method: 'PUT',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    }
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی سوال رخ داده است');
  }

  return response;
};

export const deleteExamQuestion = async (
  examId: number | string,
  questionId: number | string
) => {
  const response = await request<{ data: any }>(
    `admin/exams/${examId}/questions/${questionId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response) {
    throw new Error('خطایی در حذف سوال رخ داده است');
  }

  return response;
};
