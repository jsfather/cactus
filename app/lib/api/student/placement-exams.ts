import { ApiService } from '@/app/lib/api/client';
import {
  PlacementExamQuestion,
  PlacementExamAttempt,
} from '@/app/lib/types/placement-exam';

// Start a placement exam attempt
export const startPlacementExam = async (examId: number | string) => {
  const response = await ApiService.post<{ data: PlacementExamAttempt }>(
    `student/placement-exam/start/${examId}`
  );

  if (!response) {
    throw new Error('خطایی در شروع آزمون تعیین سطح رخ داده است');
  }

  return response;
};

// Get exam questions (using admin endpoint as you specified)
export const getExamQuestions = async (examId: number | string) => {
  const response = await ApiService.get<{ data: PlacementExamQuestion[] }>(
    `admin/exams/${examId}/questions`
  );

  if (!response) {
    throw new Error('خطایی در دریافت سوالات آزمون رخ داده است');
  }

  return response;
};

// Submit an answer
export const submitPlacementExamAnswer = async (data: {
  attempt_id: number | string;
  question_id: number | string;
  option_id: number | string;
}) => {
  const response = await ApiService.post<{ data: any }>(
    'student/placement-exam/submit-answer',
    data
  );

  if (!response) {
    throw new Error('خطایی در ثبت پاسخ رخ داده است');
  }

  return response;
};

// Finish placement exam
export const finishPlacementExam = async (attemptId: number | string) => {
  const response = await ApiService.post<{ data: any }>(
    `student/placement-exam/finish/${attemptId}`
  );

  if (!response) {
    throw new Error('خطایی در پایان آزمون رخ داده است');
  }

  return response;
};
