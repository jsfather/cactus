import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CreateReportRequest,
  ReportListResponse,
  ReportResponse,
  CreateReportResponse,
} from '@/lib/types/report';

export class ReportService {
  async getList(): Promise<ReportListResponse> {
    return apiClient.get<ReportListResponse>(
      API_ENDPOINTS.PANEL.TEACHER.REPORTS.GET_ALL
    );
  }

  async getById(id: string): Promise<ReportResponse> {
    return apiClient.get<ReportResponse>(
      API_ENDPOINTS.PANEL.TEACHER.REPORTS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateReportRequest): Promise<CreateReportResponse> {
    return apiClient.post<CreateReportResponse>(
      API_ENDPOINTS.PANEL.TEACHER.REPORTS.CREATE,
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.TEACHER.REPORTS.DELETE(id)
    );
  }
}

export const reportService = new ReportService();
