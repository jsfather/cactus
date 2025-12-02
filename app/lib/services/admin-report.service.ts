import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { ReportListResponse } from '@/lib/types/report';

export class AdminReportService {
  async getList(params?: {
    term_id?: number;
    term_teacher_schedule_id?: number;
  }): Promise<ReportListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.term_id) {
      queryParams.append('term_id', params.term_id.toString());
    }
    if (params?.term_teacher_schedule_id) {
      queryParams.append(
        'term_teacher_schedule_id',
        params.term_teacher_schedule_id.toString()
      );
    }

    const url = `${API_ENDPOINTS.PANEL.ADMIN.REPORTS.GET_ALL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ReportListResponse>(url);
  }
}

export const adminReportService = new AdminReportService();
