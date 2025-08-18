import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { GetSettingsResponse, Settings } from '@/app/lib/types/settings';

export class SettingsService {
  async getSettings(): Promise<GetSettingsResponse> {
    return apiClient.get<GetSettingsResponse>(API_ENDPOINTS.SETTINGS.GET);
  }

  async updateSettings(payload: Settings): Promise<GetSettingsResponse> {
    return apiClient.put<GetSettingsResponse>(
      API_ENDPOINTS.SETTINGS.UPDATE,
      payload
    );
  }
}

export const settingsService = new SettingsService();
