import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CreateBlogRequest,
  UpdateBlogRequest,
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

  async create(payload: CreateBlogRequest): Promise<GetBlogResponse> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('little_description', payload.little_description);
    formData.append('description', payload.description);
    formData.append('meta_title', payload.meta_title);
    formData.append('meta_description', payload.meta_description);
    formData.append('slug', payload.slug);
    formData.append('user_id', payload.user_id.toString());
    formData.append('publish_at', payload.publish_at);
    payload.tags.forEach((tag) => formData.append('tags[]', tag));
    if (payload.image) formData.append('image', payload.image);

    return apiClient.post<GetBlogResponse>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.CREATE,
      formData
    );
  }

  async update(
    id: string,
    payload: UpdateBlogRequest
  ): Promise<GetBlogResponse> {
    return apiClient.put<GetBlogResponse>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.BLOG.DELETE(id));
  }

  async setCommentApproval(
    id: string,
    approved: boolean
  ): Promise<{ message?: string }> {
    const formData = new FormData();
    formData.append('approved', approved ? '1' : '0');
    return apiClient.post<{ message?: string }>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.COMMENTS.APPROVE(id),
      formData
    );
  }

  async answerComment(
    id: string,
    answer: string
  ): Promise<{ message?: string }> {
    const formData = new FormData();
    formData.append('answer', answer);
    return apiClient.post<{ message?: string }>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.COMMENTS.ANSWER(id),
      formData
    );
  }

  async deleteComment(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.BLOG.COMMENTS.DELETE(id)
    );
  }
}

export const blogService = new BlogService();
