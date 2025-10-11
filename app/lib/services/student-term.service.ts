import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetStudentTermListResponse,
  GetStudentTermResponse,
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
}

export const studentTermService = new StudentTermService();
