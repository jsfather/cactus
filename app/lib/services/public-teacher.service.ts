import { publicApiClient } from '@/app/lib/api/client';
import { GetTeacherListResponse } from '@/app/lib/types/teacher';

export class PublicTeacherService {
  async getHomeTeachers(): Promise<GetTeacherListResponse> {
    return publicApiClient.get<GetTeacherListResponse>('/home/teachers');
  }
}

export const publicTeacherService = new PublicTeacherService();
