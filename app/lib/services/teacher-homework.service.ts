import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTeacherHomeworkListResponse,
  GetTeacherHomeworkResponse,
  CreateTeacherHomeworkRequest,
  CreateTeacherHomeworkResponse,
  TeacherHomework,
  GetHomeworkConversationResponse,
  SendHomeworkConversationMessageRequest,
  SendHomeworkConversationMessageResponse,
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
      formData.append('term_id', payload.term_id.toString());
      formData.append('term_teacher_schedule_id', payload.term_teacher_schedule_id.toString());
      formData.append('description', payload.description);
      
      if (payload.offline_session_id) {
        formData.append('offline_session_id', payload.offline_session_id.toString());
      }
      
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

  /**
   * Get homework conversation by conversation ID
   */
  async getConversation(conversationId: string): Promise<GetHomeworkConversationResponse> {
    try {
      const response = await apiClient.get<GetHomeworkConversationResponse>(
        API_ENDPOINTS.PANEL.TEACHER.HOMEWORKS.CONVERSATION.GET(conversationId)
      );

      if (!response) {
        throw new Error('خطایی در دریافت گفتگو رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error fetching homework conversation:', error);
      throw error;
    }
  }

  /**
   * Send a reply message to homework conversation
   */
  async sendConversationReply(payload: SendHomeworkConversationMessageRequest): Promise<SendHomeworkConversationMessageResponse> {
    try {
      const response = await apiClient.post<SendHomeworkConversationMessageResponse>(
        API_ENDPOINTS.PANEL.TEACHER.HOMEWORKS.CONVERSATION.REPLY,
        payload
      );

      if (!response) {
        throw new Error('خطایی در ارسال پیام رخ داده است');
      }

      return response;
    } catch (error) {
      console.error('Error sending conversation reply:', error);
      throw error;
    }
  }
}

export const teacherHomeworkService = new TeacherHomeworkService();