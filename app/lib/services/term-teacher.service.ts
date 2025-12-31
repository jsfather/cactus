import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTermTeacherListResponse,
  GetTermTeacherResponse,
  TermTeacherDetail,
  CreateTermTeacherRequest,
  UpdateTermTeacherRequest,
  CreateTermTeacherResponse,
  UpdateTermTeacherResponse,
} from '@/app/lib/types/term_teacher';

export class TermTeacherService {
  async getList(): Promise<GetTermTeacherListResponse> {
    return apiClient.get<GetTermTeacherListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.GET_ALL
    );
  }

  async getById(id: string): Promise<TermTeacherDetail> {
    return apiClient.get<TermTeacherDetail>(
      API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.GET_BY_ID(id)
    );
  }

  async create(
    payload: CreateTermTeacherRequest
  ): Promise<CreateTermTeacherResponse> {
    return apiClient.post<CreateTermTeacherResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.CREATE,
      payload
    );
  }

  async update(
    id: string,
    payload: UpdateTermTeacherRequest
  ): Promise<UpdateTermTeacherResponse> {
    return apiClient.post<UpdateTermTeacherResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.UPDATE,
      { id: parseInt(id), ...payload }
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.DELETE(id)
    );
  }
}

export const termTeacherService = new TermTeacherService();
