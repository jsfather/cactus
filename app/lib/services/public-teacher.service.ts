import { publicApiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { GetTeacherListResponse } from '@/app/lib/types/teacher';

export class PublicTeacherService {
  async getHomeTeachers(): Promise<GetTeacherListResponse> {
    return publicApiClient.get<GetTeacherListResponse>(
      API_ENDPOINTS.PUBLIC.TEACHERS.GET_ALL
    );
  }
}

export const publicTeacherService = new PublicTeacherService();
