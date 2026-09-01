import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  CoursePageContent,
  GetCoursePageListResponse,
  GetCoursePageResponse,
  CreateCoursePageRequest,
  UpdateCoursePageRequest,
} from '@/app/lib/types/course';

const parsePublished = (value: unknown) =>
  value === true || value === 1 || value === '1' || value === 'true';

const normalizeCourse = (course: CoursePageContent): CoursePageContent => {
  const record = course as CoursePageContent & {
    term?: { id?: number | string };
    teacher?: { id?: number | string; user_id?: number | string };
    level_data?: { id?: number | string };
    published?: unknown;
    status?: string;
  };
  const nestedLevel = (course as unknown as {
    level?: { id?: number | string };
  }).level;
  const difficulty =
    typeof course.level === 'string' ? course.level : 'beginner';

  return {
    ...course,
    term_id: course.term_id ?? record.term?.id ?? '',
    teacher_id:
      course.teacher_id ?? record.teacher?.user_id ?? record.teacher?.id ?? '',
    level_id: course.level_id ?? record.level_data?.id ?? nestedLevel?.id ?? '',
    level: difficulty,
    title: course.title || course.topic || '',
    topic: course.topic || course.title,
    is_published:
      parsePublished(course.is_published) ||
      parsePublished(record.published) ||
      record.status === 'published',
    related_blog_tags: course.related_blog_tags || [],
    faqs: course.faqs || [],
    syllabus: course.syllabus || [],
    video_testimonials: course.video_testimonials || [],
    recommended_tools: (course.recommended_tools || []).map((tool) => ({
      ...tool,
      link: tool.link || tool.url || '',
      icon: tool.icon || tool.emoji || '',
    })),
  };
};

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
    await apiClient.put<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.UPDATE(id),
      payload
    );
    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.COURSES.DELETE(id));
  }
}

export const coursePageService = new CoursePageService();
