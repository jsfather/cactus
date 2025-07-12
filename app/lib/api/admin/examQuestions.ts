import request from '@/app/lib/api/client';
import { ExamQuestion } from '@/app/lib/types';

// Get all questions for a specific exam
export const getExamQuestions = async (examId: number | string) => {
  const response = await request<{ data: ExamQuestion[] }>(`/api/admin/exams/${examId}/questions`);

  if (!response?.data) {
    throw new Error('خطایی در دریافت سوالات آزمون رخ داده است');
  }

  return response.data;
};

// Get a specific question
export const getExamQuestion = async (examId: number | string, questionId: number | string) => {
  const response = await request<{ data: ExamQuestion }>(`/api/admin/exams/${examId}/questions/${questionId}`);

  if (!response?.data) {
    throw new Error('خطایی در دریافت سوال رخ داده است');
  }

  return response.data;
};

// Create a new question
export const createExamQuestion = async (examId: number | string, data: Partial<ExamQuestion>) => {
  const response = await request<{ data: ExamQuestion; message: string }>(`/api/admin/exams/${examId}/questions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در ایجاد سوال رخ داده است');
  }

  return response.data;
};

// Update a question
export const updateExamQuestion = async (examId: number | string, questionId: number | string, data: Partial<ExamQuestion>) => {
  const response = await request<{ data: ExamQuestion; message: string }>(`/api/admin/exams/${examId}/questions/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در بروزرسانی سوال رخ داده است');
  }

  return response.data;
};

// Delete a question
export const deleteExamQuestion = async (examId: number | string, questionId: number | string) => {
  const response = await request<{ message: string }>(`/api/admin/exams/${examId}/questions/${questionId}`, {
    method: 'DELETE',
  });

  if (!response?.message) {
    throw new Error('خطایی در حذف سوال رخ داده است');
  }

  return response;
};
