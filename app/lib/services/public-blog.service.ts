import axios from 'axios';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { GetBlogListResponse, GetBlogResponse } from '@/app/lib/types';

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
}

export const publicBlogService = new PublicBlogService();
