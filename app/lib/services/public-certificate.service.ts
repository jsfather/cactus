import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { CertificateListResponse } from '@/lib/types/certificate';

export class PublicCertificateService {
  async getList(category?: string): Promise<CertificateListResponse> {
    const params = category ? { category } : {};
    return apiClient.get<CertificateListResponse>(
      API_ENDPOINTS.HOME.CERTIFICATES,
      { params }
    );
  }
}

export const publicCertificateService = new PublicCertificateService();
