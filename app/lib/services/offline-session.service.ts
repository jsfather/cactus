import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CreateOfflineSessionRequest,
  UpdateOfflineSessionRequest,
  GetOfflineSessionListResponse,
  GetOfflineSessionResponse,
  CreateOfflineSessionResponse,
} from '@/app/lib/types/offline-session';

export class OfflineSessionService {
  async getList(): Promise<GetOfflineSessionListResponse> {
    return apiClient.get<GetOfflineSessionListResponse>(
      API_ENDPOINTS.PANEL.TEACHER.OFFLINE_SESSIONS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetOfflineSessionResponse> {
    return apiClient.get<GetOfflineSessionResponse>(
      API_ENDPOINTS.PANEL.TEACHER.OFFLINE_SESSIONS.GET_BY_ID(id)
    );
  }

  async create(
    payload: CreateOfflineSessionRequest
  ): Promise<CreateOfflineSessionResponse> {
    return apiClient.post<CreateOfflineSessionResponse>(
      API_ENDPOINTS.PANEL.TEACHER.OFFLINE_SESSIONS.CREATE,
      payload
    );
  }

  async update(
    id: string,
    payload: UpdateOfflineSessionRequest
  ): Promise<GetOfflineSessionResponse> {
    return apiClient.put<GetOfflineSessionResponse>(
      API_ENDPOINTS.PANEL.TEACHER.OFFLINE_SESSIONS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.TEACHER.OFFLINE_SESSIONS.DELETE(id)
    );
  }
}

export const offlineSessionService = new OfflineSessionService();
