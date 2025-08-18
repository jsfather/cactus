import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTermListResponse,
  GetTermResponse,
  CreateTermRequest,
  UpdateTermRequest,
} from '@/app/lib/types';

export class TermService {
  async getList(): Promise<GetTermListResponse> {
    return apiClient.get<GetTermListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TERMS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetTermResponse> {
    return apiClient.get<GetTermResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TERMS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateTermRequest): Promise<GetTermResponse> {
    return apiClient.post<GetTermResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TERMS.CREATE,
      payload
    );
  }

  async update(id: string, payload: UpdateTermRequest): Promise<GetTermResponse> {
    return apiClient.put<GetTermResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TERMS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.TERMS.DELETE(id)
    );
  }
}

export const termService = new TermService();
