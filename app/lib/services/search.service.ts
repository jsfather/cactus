import axios from 'axios';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  SearchParams,
  SearchBlogsResponse,
  SearchProductsResponse,
} from '@/app/lib/types/search';

export class SearchService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  async searchBlogs(params?: SearchParams): Promise<SearchBlogsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tags) queryParams.append('tags', params.tags);
    if (params?.page) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const url = `${this.baseURL}${API_ENDPOINTS.PUBLIC.BLOG.GET_ALL}${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get<SearchBlogsResponse>(url);
    return response.data;
  }

  async searchProducts(params?: SearchParams): Promise<SearchProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const url = `${this.baseURL}${API_ENDPOINTS.PUBLIC.SHOP.HOME_PRODUCTS}${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get<SearchProductsResponse>(url);
    return response.data;
  }
}

export const searchService = new SearchService();
