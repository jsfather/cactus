import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTeacherTicketListResponse,
  GetTeacherTicketResponse,
  TeacherReplyTicketRequest,
  TeacherReplyTicketResponse,
} from '@/app/lib/types';

export class TeacherTicketService {
  async getList(): Promise<GetTeacherTicketListResponse> {
    return apiClient.get<GetTeacherTicketListResponse>(
      API_ENDPOINTS.PANEL.TEACHER.TICKETS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetTeacherTicketResponse> {
    return apiClient.get<GetTeacherTicketResponse>(
      API_ENDPOINTS.PANEL.TEACHER.TICKETS.GET_BY_ID(id)
    );
  }

  async replyToTicket(
    id: string,
    payload: TeacherReplyTicketRequest
  ): Promise<TeacherReplyTicketResponse> {
    return apiClient.post<TeacherReplyTicketResponse>(
      API_ENDPOINTS.PANEL.TEACHER.TICKETS.REPLY(id),
      payload
    );
  }
}

export const teacherTicketService = new TeacherTicketService();
