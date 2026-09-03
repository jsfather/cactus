import { publicApiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetCourseListResponse,
  GetCourseResponse,
  CourseListParams,
} from '@/app/lib/types/course';
import { normalizePublicCourse } from '@/app/lib/utils/course';

export class PublicCourseService {
  async getList(params?: CourseListParams): Promise<GetCourseListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.topic) queryParams.append('topic', params.topic);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.age_group) queryParams.append('age_group', params.age_group);
    if (params?.price_type) queryParams.append('price_type', params.price_type);
    if (params?.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const url = `${API_ENDPOINTS.PUBLIC.COURSES.GET_ALL}${queryString ? `?${queryString}` : ''}`;
    const response = await publicApiClient.get<GetCourseListResponse>(url);

    return {
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map(normalizePublicCourse)
        : [],
    };
  }

  async getById(id: string): Promise<GetCourseResponse> {
    const response = await publicApiClient.get<GetCourseResponse>(
      API_ENDPOINTS.PUBLIC.COURSES.GET_BY_ID(id)
    );
    return { ...response, data: normalizePublicCourse(response.data) };
  }
}

export const publicCourseService = new PublicCourseService();
