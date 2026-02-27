import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  OfflineSessionListResponse,
  OfflineSessionResponse,
  OfflineSessionCreateRequest,
  OfflineSessionUpdateRequest,
} from '@/lib/types/offline-session';

export class AdminOfflineSessionService {
  async getList(
    termId?: string | number,
    page: number = 1
  ): Promise<OfflineSessionListResponse> {
    const params: Record<string, any> = { page };
    if (termId) {
      params.term_id = termId;
    }
    return apiClient.get<OfflineSessionListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.OFFLINE_SESSIONS.GET_ALL,
      { params }
    );
  }

  async getById(id: string): Promise<OfflineSessionResponse> {
    return apiClient.get<OfflineSessionResponse>(
      API_ENDPOINTS.PANEL.ADMIN.OFFLINE_SESSIONS.GET_BY_ID(id)
    );
  }

  async create(
    payload: OfflineSessionCreateRequest
  ): Promise<OfflineSessionResponse> {
    return apiClient.post<OfflineSessionResponse>(
      API_ENDPOINTS.PANEL.ADMIN.OFFLINE_SESSIONS.CREATE,
      payload
    );
  }

  async update(
    id: string,
    payload: OfflineSessionUpdateRequest
  ): Promise<OfflineSessionResponse> {
    return apiClient.put<OfflineSessionResponse>(
      API_ENDPOINTS.PANEL.ADMIN.OFFLINE_SESSIONS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.OFFLINE_SESSIONS.DELETE(id)
    );
  }
}

export const adminOfflineSessionService = new AdminOfflineSessionService();
