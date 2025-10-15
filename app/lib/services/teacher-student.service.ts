import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetStudentListResponse,
  GetStudentResponse,
} from '@/app/lib/types/student';

class TeacherStudentService {
  /**
   * Get all students for teacher
   */
  async getAll(page: number = 1): Promise<GetStudentListResponse> {
    return apiClient.get<GetStudentListResponse>(
      API_ENDPOINTS.PANEL.TEACHER.STUDENTS.GET_ALL,
      {
        params: { page },
      }
    );
  }

  /**
   * Get student by ID
   */
  async getById(id: string): Promise<GetStudentResponse> {
    return apiClient.get<GetStudentResponse>(
      API_ENDPOINTS.PANEL.TEACHER.STUDENTS.GET_BY_ID(id)
    );
  }

  /**
   * Get students by term ID
   */
  async getByTermId(
    termId: string,
    page: number = 1
  ): Promise<GetStudentListResponse> {
    return apiClient.get<GetStudentListResponse>(
      API_ENDPOINTS.PANEL.TEACHER.STUDENTS.GET_BY_TERM(termId),
      {
        params: { page },
      }
    );
  }
}

export const teacherStudentService = new TeacherStudentService();
