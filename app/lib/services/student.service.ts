import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetStudentListResponse,
  GetStudentResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
} from '@/app/lib/types';

export class StudentService {
  async getList(): Promise<GetStudentListResponse> {
    return apiClient.get<GetStudentListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetStudentResponse> {
    return apiClient.get<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateStudentRequest): Promise<GetStudentResponse> {
    return apiClient.post<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.CREATE,
      payload
    );
  }

  async update(id: string, payload: UpdateStudentRequest): Promise<GetStudentResponse> {
    return apiClient.put<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.DELETE(id)
    );
  }
}

export const studentService = new StudentService();
