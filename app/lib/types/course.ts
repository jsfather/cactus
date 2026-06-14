export type CourseTopic = 'robotics' | 'programming' | 'ai' | 'electronics';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseAgeGroup = '6-10' | '10-14' | '14-18' | '18+';
export type CoursePriceType = 'free' | 'paid';

export interface CourseFAQ {
  id?: number | string;
  question: string;
  answer: string;
}

export interface CourseVideoTestimonial {
  id?: number | string;
  student_name: string;
  title?: string;
  video_url: string;
  thumbnail_url?: string;
}

export interface CourseSyllabusSection {
  id?: number | string;
  title: string;
  items: string[];
}

export interface CourseRecommendedTool {
  id?: number | string;
  name: string;
  description?: string;
  link: string;
  icon?: string;
}

export interface PublicCourse {
  id: number | string;
  title: string;
  description: string;
  little_description?: string;
  duration: string;
  level: CourseLevel;
  level_label: string;
  topic: CourseTopic;
  topic_label: string;
  age_group: CourseAgeGroup;
  age_group_label: string;
  price_type: CoursePriceType;
  price: number;
  price_label: string;
  image: string;
  rating: number;
  rating_count: number;
  student_count?: number;
  term_id?: number | string;
  is_popular?: boolean;
  created_at?: string;
}

export interface CoursePageContent {
  id: number | string;
  term_id: number | string;
  course_id?: number | string;
  title: string;
  supplementary_description?: string;
  intro_video_url?: string;
  certificate_video_url?: string;
  faqs: CourseFAQ[];
  video_testimonials: CourseVideoTestimonial[];
  syllabus: CourseSyllabusSection[];
  related_blog_tags: string[];
  recommended_tools: CourseRecommendedTool[];
  rating?: number;
  rating_count?: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PublicCourseDetail extends PublicCourse {
  page_content: CoursePageContent;
  instructor?: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  schedule?: Array<{
    day: string;
    time: string;
    duration: string;
  }>;
  prerequisites?: string[];
  what_you_will_learn?: string[];
}

export interface GetCourseListResponse {
  data: PublicCourse[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface GetCourseResponse {
  data: PublicCourseDetail;
}

export interface GetCoursePageListResponse {
  data: CoursePageContent[];
}

export interface GetCoursePageResponse {
  data: CoursePageContent;
}

export interface CreateCoursePageRequest {
  term_id: number | string;
  title: string;
  supplementary_description?: string;
  intro_video_url?: string;
  certificate_video_url?: string;
  faqs?: CourseFAQ[];
  video_testimonials?: CourseVideoTestimonial[];
  syllabus?: CourseSyllabusSection[];
  related_blog_tags?: string[];
  recommended_tools?: CourseRecommendedTool[];
  is_published?: boolean;
}

export type UpdateCoursePageRequest = Partial<CreateCoursePageRequest>;

export interface CourseListParams {
  search?: string;
  topic?: CourseTopic | '';
  level?: CourseLevel | '';
  age_group?: CourseAgeGroup | '';
  price_type?: CoursePriceType | '';
  sort?: 'newest' | 'popular';
}
