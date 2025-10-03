import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetStudentTicketListResponse,
  GetStudentTicketResponse,
  CreateStudentTicketRequest,
  CreateStudentTicketResponse,
  GetTicketDepartmentListResponse,
} from '@/app/lib/types';

export class StudentTicketService {
  async getTickets(): Promise<GetStudentTicketListResponse> {
    return apiClient.get<GetStudentTicketListResponse>(
      API_ENDPOINTS.STUDENT.TICKETS.GET_ALL
    );
  }

  async getTicketById(id: string): Promise<GetStudentTicketResponse> {
    return apiClient.get<GetStudentTicketResponse>(
      API_ENDPOINTS.STUDENT.TICKETS.GET_BY_ID(id)
    );
  }

  async createTicket(
    payload: CreateStudentTicketRequest
  ): Promise<CreateStudentTicketResponse> {
    return apiClient.post<CreateStudentTicketResponse>(
      API_ENDPOINTS.STUDENT.TICKETS.CREATE,
      payload
    );
  }

  async getDepartments(): Promise<GetTicketDepartmentListResponse> {
    return apiClient.get<GetTicketDepartmentListResponse>(
      API_ENDPOINTS.STUDENT.TICKETS.DEPARTMENTS
    );
  }
}

export const studentTicketService = new StudentTicketService();
