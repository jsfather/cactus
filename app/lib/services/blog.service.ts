import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  BlogRequest,
  GetBlogListResponse,
  GetBlogResponse,
} from '@/app/lib/types';

export class BlogService {
  async getList(): Promise<GetBlogListResponse> {
    return apiClient.get<GetBlogListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.GET_ALL
    );
  }

  async getById(id: string): Promise<GetBlogResponse> {
    return apiClient.get<GetBlogResponse>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.GET_BY_ID(id)
    );
  }

  async create(payload: BlogRequest): Promise<GetBlogResponse> {
    return apiClient.post<GetBlogResponse>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.CREATE,
      payload
    );
  }

  async update(id: string, payload: BlogRequest): Promise<GetBlogResponse> {
    return apiClient.put<GetBlogResponse>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.BLOG.DELETE(id));
  }
}

export const blogService = new BlogService();
