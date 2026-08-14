import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CoursePageContent,
  GetCoursePageListResponse,
  GetCoursePageResponse,
  CreateCoursePageRequest,
  UpdateCoursePageRequest,
} from '@/app/lib/types/course';

const normalizeCourse = (course: CoursePageContent): CoursePageContent => ({
  ...course,
  title: course.title || course.topic || '',
  topic: course.topic || course.title,
  related_blog_tags: course.related_blog_tags || [],
  faqs: course.faqs || [],
  syllabus: course.syllabus || [],
  video_testimonials: course.video_testimonials || [],
  recommended_tools: (course.recommended_tools || []).map((tool) => ({
    ...tool,
    link: tool.link || tool.url || '',
    icon: tool.icon || tool.emoji || '',
  })),
});

export class CoursePageService {
  async getList(): Promise<GetCoursePageListResponse> {
    const response = await apiClient.get<GetCoursePageListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.GET_ALL
    );
    return { ...response, data: response.data.map(normalizeCourse) };
  }

  async getById(id: string): Promise<GetCoursePageResponse> {
    const response = await apiClient.get<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.GET_BY_ID(id)
    );
    return { ...response, data: normalizeCourse(response.data) };
  }

  async create(
    payload: CreateCoursePageRequest
  ): Promise<GetCoursePageResponse> {
    return apiClient.post<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.CREATE,
      payload
    );
  }

  async update(
    id: string,
    payload: UpdateCoursePageRequest
  ): Promise<GetCoursePageResponse> {
    return apiClient.put<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.COURSES.DELETE(id));
  }
}

export const coursePageService = new CoursePageService();
