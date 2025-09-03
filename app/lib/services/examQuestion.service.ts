import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CreateQuestionRequest,
  UpdateQuestionRequest,
  GetQuestionsResponse,
  GetQuestionResponse,
} from '@/app/lib/types';

export class ExamQuestionService {
  async getQuestions(examId: string): Promise<GetQuestionsResponse> {
    return apiClient.get<GetQuestionsResponse>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.QUESTIONS.GET_ALL(examId)
    );
  }

  async createQuestion(examId: string, payload: CreateQuestionRequest): Promise<GetQuestionResponse> {
    const formData = new FormData();
    formData.append('text', payload.text);
    formData.append('options', JSON.stringify(payload.options));

    if (payload.file) {
      formData.append('file', payload.file);
    }

    return apiClient.post<GetQuestionResponse>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.QUESTIONS.CREATE(examId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async updateQuestion(
    examId: string, 
    questionId: string, 
    payload: UpdateQuestionRequest
  ): Promise<GetQuestionResponse> {
    const formData = new FormData();
    
    if (payload.text) {
      formData.append('text', payload.text);
    }
    
    if (payload.options) {
      formData.append('options', JSON.stringify(payload.options));
    }

    if (payload.file) {
      formData.append('file', payload.file);
    }

    return apiClient.put<GetQuestionResponse>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.QUESTIONS.UPDATE(examId, questionId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async deleteQuestion(examId: string, questionId: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.QUESTIONS.DELETE(examId, questionId)
    );
  }
}

export const examQuestionService = new ExamQuestionService();
