import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { GetLevelListResponse } from '@/app/lib/types/level';

export class LevelService {
  async getList(): Promise<GetLevelListResponse> {
    return apiClient.get<GetLevelListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.LEVELS.GET_ALL
    );
  }
}

// Export singleton instance
export const levelService = new LevelService();
