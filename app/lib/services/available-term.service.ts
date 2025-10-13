import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetAvailableTermsResponse,
} from '@/app/lib/types/available-term';

export class AvailableTermService {
  async getAvailableTerms(): Promise<GetAvailableTermsResponse> {
    return apiClient.get<GetAvailableTermsResponse>(
      API_ENDPOINTS.PANEL.STUDENT.TERMS.GET_AVAILABLE
    );
  }
}

export const availableTermService = new AvailableTermService();