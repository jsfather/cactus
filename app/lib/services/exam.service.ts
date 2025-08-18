import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetExamListResponse,
  GetExamResponse,
  CreateExamRequest,
  UpdateExamRequest,
} from '@/app/lib/types';

export class ExamService {
  async getList(): Promise<GetExamListResponse> {
    return apiClient.get<GetExamListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetExamResponse> {
    return apiClient.get<GetExamResponse>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateExamRequest): Promise<GetExamResponse> {
    return apiClient.post<GetExamResponse>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.CREATE,
      payload
    );
  }

  async update(id: string, payload: UpdateExamRequest): Promise<GetExamResponse> {
    return apiClient.put<GetExamResponse>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.EXAMS.DELETE(id)
    );
  }
}

export const examService = new ExamService();
