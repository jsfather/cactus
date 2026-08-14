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

  async getPublicList(): Promise<GetPanelGuideListResponse> {
    return apiClient.get<GetPanelGuideListResponse>(
      API_ENDPOINTS.USER.PANEL_GUIDES.GET_ALL
    );
  }

  async getPublicById(id: string): Promise<GetPanelGuideResponse> {
    return apiClient.get<GetPanelGuideResponse>(
      API_ENDPOINTS.USER.PANEL_GUIDES.GET_BY_ID(id)
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
    // The documented update contract is URL-encoded PUT. If a replacement
    // file is supplied, use Laravel method spoofing because PHP does not
    // reliably parse multipart PUT bodies.
    if (payload instanceof FormData) {
      const file = payload.get('file');
      if (file instanceof File) {
        payload.append('_method', 'PUT');
        return apiClient.post<GetPanelGuideResponse>(
          API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.UPDATE(id),
          payload
        );
      }

      const body = new URLSearchParams();
      for (const key of ['title', 'description', 'type']) {
        const value = payload.get(key);
        if (typeof value === 'string') body.set(key, value);
      }
      return apiClient.put<GetPanelGuideResponse>(
        API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.UPDATE(id),
        body,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
    }

    if (payload.file) {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      if (payload.title) formData.append('title', payload.title);
      if (payload.description)
        formData.append('description', payload.description);
      if (payload.type) formData.append('type', payload.type);
      formData.append('file', payload.file);
      return apiClient.post<GetPanelGuideResponse>(
        API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.UPDATE(id),
        formData
      );
    }

    const body = new URLSearchParams();
    if (payload.title) body.set('title', payload.title);
    if (payload.description) body.set('description', payload.description);
    if (payload.type) body.set('type', payload.type);
    return apiClient.put<GetPanelGuideResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.UPDATE(id),
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PANEL.ADMIN.PANEL_GUIDES.DELETE(id));
  }
}

export const panelGuideService = new PanelGuideService();
