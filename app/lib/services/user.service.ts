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
    // If profile_picture is a File, use FormData with POST method
    if (payload.profile_picture instanceof File) {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel method spoofing
      formData.append('first_name', payload.first_name);
      formData.append('last_name', payload.last_name);
      formData.append('username', payload.username);
      formData.append('phone', payload.phone);
      if (payload.email) {
        formData.append('email', payload.email);
      }
      if (payload.national_code) {
        formData.append('national_code', payload.national_code);
      }
      formData.append('profile_picture', payload.profile_picture);

      return apiClient.post<GetProfileResponse>(
        API_ENDPOINTS.USER.UPDATE,
        formData
      );
    }

    // If no file, send as regular JSON with PUT
    const jsonPayload = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      username: payload.username,
      phone: payload.phone,
      email: payload.email,
      national_code: payload.national_code,
    };

    return apiClient.put<GetProfileResponse>(
      API_ENDPOINTS.USER.UPDATE,
      jsonPayload
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

  async update(
    id: string,
    payload: UpdateUserRequest
  ): Promise<GetUserResponse> {
    return apiClient.put<GetUserResponse>(
      API_ENDPOINTS.PANEL.ADMIN.USERS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.USERS.DELETE(id));
  }
}

export const userService = new UserService();
