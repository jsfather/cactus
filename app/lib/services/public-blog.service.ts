import axios from 'axios';
import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetBlogListResponse,
  GetBlogResponse,
  BlogReactionRequest,
  BlogReactionResponse,
  BlogCommentRequest,
  BlogCommentResponse,
} from '@/app/lib/types';

// Public blog service that doesn't require authentication
export class PublicBlogService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  async getList(): Promise<GetBlogListResponse> {
    const response = await axios.get<GetBlogListResponse>(
      `${this.baseURL}${API_ENDPOINTS.PUBLIC.BLOG.GET_ALL}`
    );
    return response.data;
  }

  async getById(id: string): Promise<GetBlogResponse> {
    const response = await axios.get<GetBlogResponse>(
      `${this.baseURL}${API_ENDPOINTS.PUBLIC.BLOG.GET_BY_ID(id)}`
    );
    return response.data;
  }

  // Reaction methods (require authentication)
  async addReaction(
    blogId: string,
    payload: BlogReactionRequest
  ): Promise<BlogReactionResponse> {
    return apiClient.post<BlogReactionResponse>(
      `/blogs/${blogId}/reaction`,
      payload
    );
  }

  // Comment methods (require authentication)
  async addComment(
    blogId: string,
    payload: BlogCommentRequest
  ): Promise<BlogCommentResponse> {
    return apiClient.post<BlogCommentResponse>(
      `/blogs/${blogId}/comments`,
      payload
    );
  }
}

export const publicBlogService = new PublicBlogService();
