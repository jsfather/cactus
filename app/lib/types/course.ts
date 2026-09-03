export type CourseTopic = string;
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
// The deployed API filters age groups by their id (for example "2") and
// returns the human-readable range separately.
export type CourseAgeGroup = string;
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
  link?: string;
  icon?: string;
  url?: string;
  emoji?: string;
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
  image?: string;
  video?: string;
  rating: number | string | null;
  rating_count: number | null;
  student_count?: number;
  term_id?: number | string;
  is_popular?: boolean;
  is_published?: boolean | number | string | null;
  created_at?: string;
}

export interface CoursePageContent {
  id: number | string;
  term_id: number | string;
  course_id?: number | string;
  title: string;
  topic?: string;
  description?: string;
  teacher_id?: number | string;
  level_id?: number | string;
  price?: number;
  capacity?: number;
  level?: CourseLevel;
  price_type?: CoursePriceType;
  image?: string;
  video?: string;
  supplementary_description?: string;
  intro_video_url?: string;
  certificate_image_url?: string;
  faqs: CourseFAQ[];
  video_testimonials: CourseVideoTestimonial[];
  syllabus: CourseSyllabusSection[];
  related_blog_tags: string[];
  related_blog_ids?: number[];
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
    page?: number;
    current_page?: number;
    per_page: number;
    last_page?: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
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
  teacher_id?: number | string;
  level_id: number | string;
  topic: string;
  description: string;
  price: number;
  capacity: number;
  level: CourseLevel;
  price_type: CoursePriceType;
  image?: string;
  video?: string;
  supplementary_description?: string;
  intro_video_url?: string;
  certificate_image_url?: string;
  faqs?: CourseFAQ[];
  video_testimonials?: CourseVideoTestimonial[];
  syllabus?: CourseSyllabusSection[];
  related_blog_ids?: number[];
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
