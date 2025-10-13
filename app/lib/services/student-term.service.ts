import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetStudentTermListResponse,
  GetStudentTermResponse,
  GetSkyRoomUrlResponse,
} from '@/app/lib/types/student-term';

export class StudentTermService {
  async getList(): Promise<GetStudentTermListResponse> {
    return apiClient.get<GetStudentTermListResponse>(
      API_ENDPOINTS.PANEL.STUDENT.TERMS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetStudentTermResponse> {
    return apiClient.get<GetStudentTermResponse>(
      API_ENDPOINTS.PANEL.STUDENT.TERMS.GET_BY_ID(id)
    );
  }

  async getSkyRoomUrl(scheduleId: string): Promise<GetSkyRoomUrlResponse> {
    return apiClient.get<GetSkyRoomUrlResponse>(
      API_ENDPOINTS.PANEL.STUDENT.TERMS.GET_SKY_ROOM_URL(scheduleId)
    );
  }
}

export const studentTermService = new StudentTermService();
