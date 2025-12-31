import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTeacherListResponse,
  GetTeacherResponse,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '@/app/lib/types/teacher';

export interface TeacherSearchFilters {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
}

export class TeacherService {
  async getList(
    filters?: TeacherSearchFilters
  ): Promise<GetTeacherListResponse> {
    const params = new URLSearchParams();

    // Add search filters if provided
    if (filters) {
      if (filters.first_name) params.set('first_name', filters.first_name);
      if (filters.last_name) params.set('last_name', filters.last_name);
      if (filters.username) params.set('username', filters.username);
      if (filters.phone) params.set('phone', filters.phone);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.PANEL.ADMIN.TEACHERS.GET_ALL}?${queryString}`
      : API_ENDPOINTS.PANEL.ADMIN.TEACHERS.GET_ALL;

    return apiClient.get<GetTeacherListResponse>(url);
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
