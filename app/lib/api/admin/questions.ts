'use client';

import { ApiService } from '@/app/lib/api/client';
import { PlacementExamQuestion } from '@/app/lib/types/placement-exam';

// Get all questions for an exam
export const getExamQuestions = async (examId: number | string) => {
  const response = await ApiService.get<{ data: PlacementExamQuestion[] }>(
    `admin/exams/${examId}/questions`
  );

  if (!response) {
    throw new Error('خطایی در دریافت سوالات آزمون رخ داده است');
  }

  return response;
};

// Create a new question for an exam
export const createExamQuestion = async (
  examId: number | string,
  data:
    | FormData
    | {
        text: string;
        options: Array<{
          text: string;
          is_correct: number;
        }>;
        file?: File;
      }
) => {
  let formData: FormData;

  if (data instanceof FormData) {
    // If already FormData, use it directly
    formData = data;
  } else {
    // Convert object to FormData
    formData = new FormData();
    formData.append('text', data.text);

    // Add options in the format server expects
    data.options.forEach((option, index) => {
      formData.append(`options[${index}][text]`, option.text);
      formData.append(
        `options[${index}][is_correct]`,
        option.is_correct.toString()
      );
    });

    if (data.file) {
      formData.append('file', data.file);
    }
  }

  const response = await ApiService.post<{ data: PlacementExamQuestion }>(
    `admin/exams/${examId}/questions`,
    formData
  );

  if (!response) {
    throw new Error('خطایی در ایجاد سوال رخ داده است');
  }

  return response;
};

// Update an existing question
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

  const response = await ApiService.put<{ data: PlacementExamQuestion }>(
    `admin/exams/${examId}/questions/${questionId}`,
    formData
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی سوال رخ داده است');
  }

  return response;
};

// Delete a question
export const deleteExamQuestion = async (
  examId: number | string,
  questionId: number | string
) => {
  const response = await ApiService.delete<{ data: any }>(
    `admin/exams/${examId}/questions/${questionId}`
  );

  if (!response) {
    throw new Error('خطایی در حذف سوال رخ داده است');
  }

  return response;
};

// Get a single question
export const getExamQuestion = async (
  examId: number | string,
  questionId: number | string
) => {
  const response = await ApiService.get<{ data: PlacementExamQuestion }>(
    `admin/exams/${examId}/questions/${questionId}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت سوال رخ داده است');
  }

  return response;
};

// Bulk import questions from file
export const importExamQuestions = async (
  examId: number | string,
  file: File
) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await ApiService.post<{
    data: {
      imported: number;
      failed: number;
      questions: PlacementExamQuestion[];
    };
  }>(`admin/exams/${examId}/questions/import`, formData);

  if (!response) {
    throw new Error('خطایی در وارد کردن سوالات رخ داده است');
  }

  return response;
};

// Export questions to file
export const exportExamQuestions = async (examId: number | string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/exams/${examId}/questions/export`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('خطایی در صادر کردن سوالات رخ داده است');
  }

  return response.blob();
};
