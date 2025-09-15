import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CreatePanelGuideRequest,
  UpdatePanelGuideRequest,
  GetPanelGuideListResponse,
  GetPanelGuideResponse,
} from '@/app/lib/types';

export class PanelGuideService {
  async getList(): Promise<GetPanelGuideListResponse> {
    return apiClient.get<GetPanelGuideListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.GET_ALL
    );
  }

  async getById(id: string): Promise<GetPanelGuideResponse> {
    return apiClient.get<GetPanelGuideResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.GET_BY_ID(id)
    );
  }

  async create(
    payload: CreatePanelGuideRequest | FormData
  ): Promise<GetPanelGuideResponse> {
    // Handle FormData for file uploads
    if (payload instanceof FormData) {
      return apiClient.post<GetPanelGuideResponse>(
        API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.CREATE,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    // Convert to FormData if it's a regular object
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('type', payload.type);
    if (payload.file) {
      formData.append('file', payload.file);
    }

    return apiClient.post<GetPanelGuideResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.CREATE,
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
    payload: UpdatePanelGuideRequest | FormData
  ): Promise<GetPanelGuideResponse> {
    // Handle FormData for file uploads
    if (payload instanceof FormData) {
      return apiClient.post<GetPanelGuideResponse>(
        API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.UPDATE(id),
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    // Convert to FormData if it's a regular object
    const formData = new FormData();
    if (payload.title) formData.append('title', payload.title);
    if (payload.description)
      formData.append('description', payload.description);
    if (payload.type) formData.append('type', payload.type);
    if (payload.file) formData.append('file', payload.file);

    return apiClient.post<GetPanelGuideResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.UPDATE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.DELETE(id));
  }
}

export const panelGuideService = new PanelGuideService();
