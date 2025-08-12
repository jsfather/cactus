import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { GetProfileResponse, UpdateProfileRequest } from '@/app/lib/types';

export class UserService {
  async getProfile(): Promise<GetProfileResponse> {
    return apiClient.get<GetProfileResponse>(API_ENDPOINTS.USER.ME);
  }

  async updateProfile(
    payload: UpdateProfileRequest
  ): Promise<GetProfileResponse> {
    return apiClient.put<GetProfileResponse>(
      API_ENDPOINTS.USER.UPDATE,
      payload
    );
  }
}

export const userService = new UserService();
