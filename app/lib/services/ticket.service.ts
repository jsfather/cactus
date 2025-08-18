import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetTicketListResponse,
  GetTicketResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  GetTicketDepartmentListResponse,
  Reply,
} from '@/app/lib/types';

export class TicketService {
  async getList(): Promise<GetTicketListResponse> {
    return apiClient.get<GetTicketListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.GET_ALL
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
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.DELETE(id)
    );
  }

  async getDepartments(): Promise<GetTicketDepartmentListResponse> {
    return apiClient.get<GetTicketDepartmentListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.TICKETS.DEPARTMENTS
    );
  }

  async reply(id: string, payload: Reply): Promise<void> {
    return apiClient.post<void>(
      `${API_ENDPOINTS.PANEL.ADMIN.TICKETS.GET_BY_ID(id)}/reply`,
      payload
    );
  }
}

export const ticketService = new TicketService();
