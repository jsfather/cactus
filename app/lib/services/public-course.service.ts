import axios from 'axios';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetCourseListResponse,
  GetCourseResponse,
  CourseListParams,
} from '@/app/lib/types/course';
import {
  filterMockCourses,
  getMockCourseById,
} from '@/app/lib/data/mock-courses';

export class PublicCourseService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  async getList(params?: CourseListParams): Promise<GetCourseListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.topic) queryParams.append('topic', params.topic);
      if (params?.level) queryParams.append('level', params.level);
      if (params?.age_group) queryParams.append('age_group', params.age_group);
      if (params?.price_type) queryParams.append('price_type', params.price_type);
      if (params?.sort) queryParams.append('sort', params.sort);

      const queryString = queryParams.toString();
      const url = `${this.baseURL}${API_ENDPOINTS.PUBLIC.COURSES.GET_ALL}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get<GetCourseListResponse>(url);
      return response.data;
    } catch {
      return { data: filterMockCourses(params) };
    }
  }

  async getById(id: string): Promise<GetCourseResponse> {
    try {
      const response = await axios.get<GetCourseResponse>(
        `${this.baseURL}${API_ENDPOINTS.PUBLIC.COURSES.GET_BY_ID(id)}`
      );
      return response.data;
    } catch {
      const course = getMockCourseById(id);
      if (!course) throw new Error('Course not found');
      return { data: course };
    }
  }
}

export const publicCourseService = new PublicCourseService();
