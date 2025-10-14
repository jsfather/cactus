import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTeacherTermListResponse,
  GetTeacherTermResponse,
  TeacherTerm,
} from '@/app/lib/types/teacher-term';

export class TeacherTermService {
  /**
   * Get list of teacher's terms
   */
  async getList(): Promise<GetTeacherTermListResponse> {
    try {
      const response = await apiClient.get<GetTeacherTermListResponse>(
        API_ENDPOINTS.PANEL.TEACHER.TERMS.GET_ALL
      );

      if (!response) {
        throw new Error('خطایی در دریافت لیست ترم‌ها رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error fetching teacher terms:', error);
      throw error;
    }
  }

  /**
   * Get teacher term by ID
   */
  async getById(id: string): Promise<GetTeacherTermResponse> {
    try {
      const response = await apiClient.get<GetTeacherTermResponse>(
        API_ENDPOINTS.PANEL.TEACHER.TERMS.GET_BY_ID(id)
      );

      if (!response) {
        throw new Error('خطایی در دریافت ترم رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error fetching teacher term:', error);
      throw error;
    }
  }
}

export const teacherTermService = new TeacherTermService();