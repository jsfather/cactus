import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetProfileResponse,
  UpdateProfileRequest,
} from '@/app/lib/types';

export class ProfileService {
  async getProfile(): Promise<GetProfileResponse> {
    return apiClient.get<GetProfileResponse>(API_ENDPOINTS.USER.ME);
  }

  async updateProfile(payload: UpdateProfileRequest): Promise<GetProfileResponse> {
    // Always use FormData since API expects profile_picture field
    const formData = new FormData();
    
    // Laravel requires _method field for PUT requests with files
    formData.append('_method', 'PUT');
    
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
    
    // Only append profile_picture if it's a valid File object
    if (payload.profile_picture && payload.profile_picture instanceof File) {
      formData.append('profile_picture', payload.profile_picture);
    }

    // Use POST with _method=PUT for Laravel file uploads
    return apiClient.post<GetProfileResponse>(
      API_ENDPOINTS.USER.UPDATE,
      formData
      // Don't set Content-Type header, let browser set it with boundary
    );
  }
}

export const profileService = new ProfileService();