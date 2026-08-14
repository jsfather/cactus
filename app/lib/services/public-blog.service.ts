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
  Blog,
} from '@/app/lib/types';

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === 'string' && item.trim() !== ''
    );
  }

  return typeof value === 'string' && value.trim() !== '' ? [value] : [];
}

function normalizeBlog(value: Blog): Blog {
  const rawBlog = value as Blog & {
    tags?: unknown;
    comments?: unknown;
  };

  return {
    ...value,
    tags: normalizeStringList(rawBlog.tags),
    comments: Array.isArray(rawBlog.comments) ? rawBlog.comments : [],
  };
}

// Public blog service that doesn't require authentication
export class PublicBlogService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  async getList(params?: {
    search?: string;
    tags?: string;
    page?: number;
  }): Promise<GetBlogListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tags) queryParams.append('tags', params.tags);
    if (params?.page) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const url = `${this.baseURL}${API_ENDPOINTS.PUBLIC.BLOG.GET_ALL}${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get<GetBlogListResponse>(url);
    const blogs = Array.isArray(response.data.data) ? response.data.data : [];

    return {
      ...response.data,
      data: blogs.map(normalizeBlog),
    };
  }

  async getById(id: string): Promise<GetBlogResponse> {
    const response = await axios.get<GetBlogResponse>(
      `${this.baseURL}${API_ENDPOINTS.PUBLIC.BLOG.GET_BY_ID(id)}`
    );
    return {
      ...response.data,
      data: normalizeBlog(response.data.data),
    };
  }

  async getTags(): Promise<{ data: string[] }> {
    const response = await axios.get<{ data: string[] }>(
      `${this.baseURL}${API_ENDPOINTS.PUBLIC.BLOG.GET_TAGS}`
    );
    return {
      ...response.data,
      data: normalizeStringList(response.data.data),
    };
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
