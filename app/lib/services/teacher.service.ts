import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTeacherListResponse,
  GetTeacherResponse,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/app/lib/types/teacher';

export class TeacherService {
  async getList(): Promise<GetTeacherListResponse> {
    return apiClient.get<GetTeacherListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TEACHERS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetTeacherResponse> {
    return apiClient.get<GetTeacherResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TEACHERS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateTeacherRequest): Promise<GetTeacherResponse> {
    return apiClient.post<GetTeacherResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TEACHERS.CREATE,
      payload
    );
  }

  async update(
    id: string,
    payload: UpdateTeacherRequest
  ): Promise<GetTeacherResponse> {
    return apiClient.put<GetTeacherResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TEACHERS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.TEACHERS.DELETE(id)
    );
  }
}

export const teacherService = new TeacherService();
