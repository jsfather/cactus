import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTeacherHomeworkListResponse,
  GetTeacherHomeworkResponse,
  CreateTeacherHomeworkRequest,
  CreateTeacherHomeworkResponse,
  UpdateTeacherHomeworkRequest,
  UpdateTeacherHomeworkResponse,
  TeacherHomework,
} from '@/app/lib/types/teacher-homework';

export class TeacherHomeworkService {
  /**
   * Get list of teacher's homeworks
   */
  async getList(): Promise<GetTeacherHomeworkListResponse> {
    try {
      const response = await apiClient.get<GetTeacherHomeworkListResponse>(
        API_ENDPOINTS.PANEL.TEACHER.HOMEWORKS.GET_ALL
      );

      if (!response) {
        throw new Error('خطایی در دریافت لیست تکالیف رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error fetching teacher homeworks:', error);
      throw error;
    }
  }

  /**
   * Get teacher homework by ID
   */
  async getById(id: string): Promise<GetTeacherHomeworkResponse> {
    try {
      const response = await apiClient.get<GetTeacherHomeworkResponse>(
        API_ENDPOINTS.PANEL.TEACHER.HOMEWORKS.GET_BY_ID(id)
      );

      if (!response) {
        throw new Error('خطایی در دریافت تکلیف رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error fetching teacher homework:', error);
      throw error;
    }
  }

  /**
   * Create a new homework
   */
  async create(payload: CreateTeacherHomeworkRequest): Promise<CreateTeacherHomeworkResponse> {
    try {
      // If there's a file, we need to use FormData
      const formData = new FormData();
      formData.append('description', payload.description);
      formData.append('schedule_id', payload.schedule_id.toString());
      
      if (payload.file) {
        formData.append('file', payload.file);
      }

      const response = await apiClient.post<CreateTeacherHomeworkResponse>(
        API_ENDPOINTS.PANEL.TEACHER.HOMEWORKS.CREATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response) {
        throw new Error('خطایی در ایجاد تکلیف رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error creating teacher homework:', error);
      throw error;
    }
  }

  /**
   * Update an existing homework
   */
  async update(id: string, payload: UpdateTeacherHomeworkRequest): Promise<UpdateTeacherHomeworkResponse> {
    try {
      // If there's a file or we need to use FormData for updates
      const formData = new FormData();
      
      if (payload.description !== undefined) {
        formData.append('description', payload.description);
      }
      
      if (payload.schedule_id !== undefined) {
        formData.append('schedule_id', payload.schedule_id.toString());
      }
      
      if (payload.file) {
        formData.append('file', payload.file);
      }

      const response = await apiClient.put<UpdateTeacherHomeworkResponse>(
        API_ENDPOINTS.PANEL.TEACHER.HOMEWORKS.UPDATE(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response) {
        throw new Error('خطایی در بروزرسانی تکلیف رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error updating teacher homework:', error);
      throw error;
    }
  }

  /**
   * Delete a homework
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(
        API_ENDPOINTS.PANEL.TEACHER.HOMEWORKS.DELETE(id)
      );
    } catch (error) {
      console.error('Error deleting teacher homework:', error);
      throw error;
    }
  }
}

export const teacherHomeworkService = new TeacherHomeworkService();