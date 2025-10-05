import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTermTeacherListResponse,
  GetTermTeacherResponse,
  CreateTermTeacherRequest,
  UpdateTermTeacherRequest,
  CreateTermTeacherResponse,
  UpdateTermTeacherResponse,
} from '@/app/lib/types/term_teacher';

export class TermTeacherService {
  async getList(): Promise<GetTermTeacherListResponse> {
    try {
      const response = await apiClient.get<GetTermTeacherListResponse>(
        API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.GET_ALL
      );
      
      if (!response) {
        throw new Error('خطایی در دریافت لیست ترم مدرسین رخ داده است');
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching term teachers:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<GetTermTeacherResponse> {
    try {
      const response = await apiClient.get<GetTermTeacherResponse>(
        API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.GET_BY_ID(id)
      );
      
      if (!response) {
        throw new Error('خطایی در دریافت ترم مدرس رخ داده است');
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching term teacher:', error);
      throw error;
    }
  }

  async create(payload: CreateTermTeacherRequest): Promise<CreateTermTeacherResponse> {
    try {
      const response = await apiClient.post<CreateTermTeacherResponse>(
        API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.CREATE,
        payload
      );
      
      if (!response) {
        throw new Error('خطایی در ایجاد ترم مدرس رخ داده است');
      }
      
      return response;
    } catch (error) {
      console.error('Error creating term teacher:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(
        API_ENDPOINTS.PANEL.ADMIN.TERM_TEACHERS.DELETE(id)
      );
    } catch (error) {
      console.error('Error deleting term teacher:', error);
      throw error;
    }
  }
}

export const termTeacherService = new TermTeacherService();