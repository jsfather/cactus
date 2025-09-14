import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CreateTicketRequest,
  UpdateTicketRequest,
  ReplyTicketRequest,
  GetTicketListResponse,
  GetTicketResponse,
  CreateTicketDepartmentRequest,
  UpdateTicketDepartmentRequest,
  GetTicketDepartmentListResponse,
  TicketDepartment,
} from '@/app/lib/types';

export class TicketService {
  // Main ticket operations
  async getList(): Promise<GetTicketListResponse> {
    return apiClient.get<GetTicketListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.GET_ALL
    );
  }

  async getTeacherTickets(): Promise<GetTicketListResponse> {
    return apiClient.get<GetTicketListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.GET_TEACHERS
    );
  }

  async getById(id: string): Promise<GetTicketResponse> {
    return apiClient.get<GetTicketResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateTicketRequest): Promise<GetTicketResponse> {
    return apiClient.post<GetTicketResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.CREATE,
      payload
    );
  }

  async update(id: string, payload: UpdateTicketRequest): Promise<GetTicketResponse> {
    return apiClient.put<GetTicketResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.TICKETS.DELETE(id));
  }

  async close(id: string): Promise<GetTicketResponse> {
    return apiClient.post<GetTicketResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.CLOSE(id)
    );
  }

  async reply(id: string, payload: ReplyTicketRequest): Promise<GetTicketResponse> {
    return apiClient.post<GetTicketResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.REPLY(id),
      payload
    );
  }

  // Department operations
  async getDepartments(): Promise<GetTicketDepartmentListResponse> {
    return apiClient.get<GetTicketDepartmentListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.DEPARTMENTS.GET_ALL
    );
  }

  async createDepartment(payload: CreateTicketDepartmentRequest): Promise<{ data: TicketDepartment }> {
    return apiClient.post<{ data: TicketDepartment }>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.DEPARTMENTS.CREATE,
      payload
    );
  }

  async updateDepartment(id: string, payload: UpdateTicketDepartmentRequest): Promise<{ data: TicketDepartment }> {
    return apiClient.put<{ data: TicketDepartment }>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.DEPARTMENTS.UPDATE(id),
      payload
    );
  }

  async deleteDepartment(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.DEPARTMENTS.DELETE(id)
    );
  }
}

export const ticketService = new TicketService();
