import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CertificateListResponse,
  CertificateResponse,
  CertificateCreateRequest,
  CertificateUpdateRequest,
} from '@/lib/types/certificate';

export class CertificateService {
  async getList(): Promise<CertificateListResponse> {
    return apiClient.get<CertificateListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.CERTIFICATES.GET_ALL
    );
  }

  async getById(id: string): Promise<CertificateResponse> {
    return apiClient.get<CertificateResponse>(
      API_ENDPOINTS.PANEL.ADMIN.CERTIFICATES.GET_BY_ID(id)
    );
  }

  async create(
    payload: CertificateCreateRequest
  ): Promise<CertificateResponse> {
    const formData = new FormData();

    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('issued_at', payload.issued_at);
    formData.append('organization', payload.organization);
    formData.append('location', payload.location);

    payload.categories.forEach((category, index) => {
      formData.append(`categories[${index}]`, category);
    });

    return apiClient.post<CertificateResponse>(
      API_ENDPOINTS.PANEL.ADMIN.CERTIFICATES.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async update(
    id: string,
    payload: CertificateUpdateRequest
  ): Promise<CertificateResponse> {
    const formData = new FormData();

    if (payload.image instanceof File) {
      formData.append('image', payload.image);
    }
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('issued_at', payload.issued_at);
    formData.append('organization', payload.organization);
    formData.append('location', payload.location);

    payload.categories.forEach((category, index) => {
      formData.append(`categories[${index}]`, category);
    });

    formData.append('_method', 'PUT');

    return apiClient.post<CertificateResponse>(
      API_ENDPOINTS.PANEL.ADMIN.CERTIFICATES.UPDATE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.CERTIFICATES.DELETE(id)
    );
  }
}

export const certificateService = new CertificateService();
