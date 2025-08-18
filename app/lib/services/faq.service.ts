import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetFAQListResponse,
  GetFAQResponse,
  CreateFAQRequest,
  UpdateFAQRequest,
} from '@/app/lib/types';

export class FAQService {
  async getList(): Promise<GetFAQListResponse> {
    return apiClient.get<GetFAQListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.FAQS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetFAQResponse> {
    return apiClient.get<GetFAQResponse>(
      API_ENDPOINTS.PANEL.ADMIN.FAQS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateFAQRequest): Promise<GetFAQResponse> {
    return apiClient.post<GetFAQResponse>(
      API_ENDPOINTS.PANEL.ADMIN.FAQS.CREATE,
      payload
    );
  }

  async update(id: string, payload: UpdateFAQRequest): Promise<GetFAQResponse> {
    return apiClient.put<GetFAQResponse>(
      API_ENDPOINTS.PANEL.ADMIN.FAQS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.FAQS.DELETE(id)
    );
  }
}

export const faqService = new FAQService();
