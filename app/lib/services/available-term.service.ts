import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetAvailableTermsResponse,
  PayForTermResponse,
} from '@/app/lib/types/available-term';

export class AvailableTermService {
  async getAvailableTerms(): Promise<GetAvailableTermsResponse> {
    return apiClient.get<GetAvailableTermsResponse>(
      API_ENDPOINTS.PANEL.STUDENT.TERMS.GET_AVAILABLE
    );
  }

  async pay(termTeacherId: number): Promise<PayForTermResponse> {
    return apiClient.post<PayForTermResponse>(
      API_ENDPOINTS.PANEL.STUDENT.TERMS.PAY,
      { term_teacher_id: termTeacherId }
    );
  }
}

export const availableTermService = new AvailableTermService();
