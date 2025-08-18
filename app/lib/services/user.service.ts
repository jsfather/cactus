import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { 
  GetProfileResponse, 
  UpdateProfileRequest,
  GetUserListResponse,
  GetUserResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/app/lib/types';

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

  // Admin user management methods
  async getList(): Promise<GetUserListResponse> {
    return apiClient.get<GetUserListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.USERS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetUserResponse> {
    return apiClient.get<GetUserResponse>(
      API_ENDPOINTS.PANEL.ADMIN.USERS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateUserRequest): Promise<GetUserResponse> {
    return apiClient.post<GetUserResponse>(
      API_ENDPOINTS.PANEL.ADMIN.USERS.CREATE,
      payload
    );
  }

  async update(id: string, payload: UpdateUserRequest): Promise<GetUserResponse> {
    return apiClient.put<GetUserResponse>(
      API_ENDPOINTS.PANEL.ADMIN.USERS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.USERS.DELETE(id)
    );
  }
}

export const userService = new UserService();
