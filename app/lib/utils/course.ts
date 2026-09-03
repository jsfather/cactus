import type {
  CourseAgeGroup,
  CourseFAQ,
  CourseLevel,
  CoursePageContent,
  CoursePriceType,
  CourseRecommendedTool,
  CourseSyllabusSection,
  CourseVideoTestimonial,
  PublicCourseDetail,
} from '@/app/lib/types/course';

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
};

const asNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const parseCoursePublished = (value: unknown): boolean =>
  value === true || value === 1 || value === '1' || value === 'true';

const firstDefined = (...values: unknown[]): unknown =>
  values.find((value) => value !== undefined && value !== null);

const normalizeLevel = (value: unknown): CourseLevel =>
  value === 'intermediate' || value === 'advanced' ? value : 'beginner';

const normalizePriceType = (value: unknown): CoursePriceType =>
  value === 'free' ? 'free' : 'paid';

const normalizeFaqs = (value: unknown): CourseFAQ[] =>
  asArray(value)
    .map(asRecord)
    .map((faq) => ({
      id: firstDefined(faq.id) as number | string | undefined,
      question: asString(faq.question),
      answer: asString(faq.answer),
    }))
    .filter((faq) => faq.question || faq.answer);

const normalizeTestimonials = (value: unknown): CourseVideoTestimonial[] =>
  asArray(value)
    .map(asRecord)
    .map((testimonial) => ({
      id: firstDefined(testimonial.id) as number | string | undefined,
      student_name: asString(testimonial.student_name),
      title: asString(testimonial.title) || undefined,
      video_url: asString(testimonial.video_url),
      thumbnail_url: asString(testimonial.thumbnail_url) || undefined,
    }))
    .filter((testimonial) => testimonial.student_name || testimonial.video_url);

const normalizeSyllabus = (value: unknown): CourseSyllabusSection[] =>
  asArray(value)
    .map(asRecord)
    .map((section) => ({
      id: firstDefined(section.id) as number | string | undefined,
      title: asString(section.title),
      items: asArray(section.items)
        .map((item) => asString(item))
        .filter(Boolean),
    }))
    .filter((section) => section.title || section.items.length > 0);

const normalizeTools = (value: unknown): CourseRecommendedTool[] =>
  asArray(value)
    .map(asRecord)
    .map((tool) => {
      const link = asString(firstDefined(tool.link, tool.url));
      const icon = asString(firstDefined(tool.icon, tool.emoji));

      return {
        id: firstDefined(tool.id) as number | string | undefined,
        name: asString(tool.name),
        description: asString(tool.description) || undefined,
        link: link || undefined,
        url: link || undefined,
        icon: icon || undefined,
        emoji: icon || undefined,
      };
    })
    .filter((tool) => tool.name);

const normalizeStringArray = (value: unknown): string[] =>
  asArray(value)
    .map((item) => asString(item))
    .filter(Boolean);

const normalizeIdArray = (value: unknown): number[] =>
  asArray(value)
    .map((item) => asNumber(asRecord(item).id || item, Number.NaN))
    .filter((id) => Number.isInteger(id) && id > 0);

export function normalizeCoursePageContent(
  value: unknown,
  courseValue?: unknown
): CoursePageContent {
  const page = asRecord(value);
  const course = asRecord(courseValue);
  const term = asRecord(course.term);
  const teacher = asRecord(course.teacher);
  const ageGroup = asRecord(course.age_group);
  const levelData = asRecord(course.level_data);
  const courseId = firstDefined(course.course_id, course.id, page.course_id);
  const termId = firstDefined(page.term_id, course.term_id, term.id, '');
  const title = asString(
    firstDefined(page.title, page.topic, course.title, course.topic, term.title)
  );
  const publishedValue = firstDefined(
    page.is_published,
    course.is_published,
    course.published,
    course.status === 'published' ? true : undefined
  );
  const image = asString(firstDefined(page.image, course.image));
  const video = asString(firstDefined(page.video, course.video));
  const blogs = asArray(course.blogs);
  const relatedBlogIds = normalizeIdArray(page.related_blog_ids);

  return {
    id: firstDefined(page.id, course.id, '') as number | string,
    term_id: termId as number | string,
    course_id: courseId as number | string | undefined,
    title,
    topic: asString(firstDefined(page.topic, course.topic, title)),
    description: asString(firstDefined(page.description, course.description)),
    teacher_id: firstDefined(
      page.teacher_id,
      course.teacher_id,
      teacher.user_id,
      teacher.id
    ) as number | string | undefined,
    level_id: firstDefined(
      page.level_id,
      course.level_id,
      levelData.id,
      ageGroup.id,
      term.level_id
    ) as number | string | undefined,
    price: asNumber(firstDefined(page.price, course.price, term.price)),
    capacity: asNumber(
      firstDefined(page.capacity, course.capacity, term.capacity),
      1
    ),
    level: normalizeLevel(firstDefined(page.level, course.level)),
    price_type: normalizePriceType(
      firstDefined(page.price_type, course.price_type)
    ),
    image: image || undefined,
    video: video || undefined,
    supplementary_description:
      asString(page.supplementary_description) || undefined,
    intro_video_url:
      asString(firstDefined(page.intro_video_url, video)) || undefined,
    certificate_image_url: asString(page.certificate_image_url) || undefined,
    faqs: normalizeFaqs(page.faqs),
    video_testimonials: normalizeTestimonials(page.video_testimonials),
    syllabus: normalizeSyllabus(page.syllabus),
    related_blog_tags: normalizeStringArray(page.related_blog_tags),
    related_blog_ids:
      relatedBlogIds.length > 0 ? relatedBlogIds : normalizeIdArray(blogs),
    recommended_tools: normalizeTools(page.recommended_tools),
    rating: asNumber(firstDefined(page.rating, course.rating)),
    rating_count: asNumber(
      firstDefined(page.rating_count, course.rating_count)
    ),
    is_published:
      publishedValue === undefined
        ? true
        : parseCoursePublished(publishedValue),
    created_at:
      asString(firstDefined(page.created_at, course.created_at)) || undefined,
    updated_at:
      asString(firstDefined(page.updated_at, course.updated_at)) || undefined,
  };
}

const formatDuration = (course: UnknownRecord, term: UnknownRecord): string => {
  const explicit = asString(course.duration);
  if (explicit) return explicit;

  const sessions = asNumber(term.number_of_sessions);
  const minutes = asNumber(term.duration);
  if (sessions && minutes) return `${sessions} جلسه، هر جلسه ${minutes} دقیقه`;
  if (sessions) return `${sessions} جلسه`;
  if (minutes) return `${minutes} دقیقه`;
  return '—';
};

const normalizeInstructor = (value: unknown) => {
  const teacher = asRecord(value);
  if (!Object.keys(teacher).length) return undefined;

  const user = asRecord(teacher.user);
  const firstName = asString(user.first_name);
  const lastName = asString(user.last_name);
  const name = asString(teacher.name) || `${firstName} ${lastName}`.trim();
  if (!name) return undefined;

  return {
    id: asString(firstDefined(teacher.id, teacher.user_id, user.id)),
    name,
    role: asString(firstDefined(teacher.role, user.role)) || 'مدرس دوره',
    avatar: asString(
      firstDefined(
        teacher.avatar,
        teacher.profile_picture,
        user.profile_picture
      )
    ),
    bio: asString(firstDefined(teacher.bio, teacher.about_me)),
  };
};

export function normalizePublicCourse(value: unknown): PublicCourseDetail {
  const course = asRecord(value);
  const term = asRecord(course.term);
  const ageGroup = asRecord(course.age_group);
  const pageContent = normalizeCoursePageContent(course.page_content, course);
  const title = asString(
    firstDefined(course.title, course.topic, term.title, pageContent.title)
  );
  const topic = asString(firstDefined(course.topic, course.title, title));
  const level = normalizeLevel(course.level);
  const ageGroupId = asString(firstDefined(ageGroup.id, course.age_group));
  const ageGroupLabel = asString(
    firstDefined(course.age_group_label, ageGroup.name, course.age_group)
  );
  const price = asNumber(firstDefined(course.price, term.price));
  const image = asString(course.image);
  const video = asString(course.video);

  return {
    id: firstDefined(course.id, '') as number | string,
    term_id: firstDefined(course.term_id, term.id) as
      | number
      | string
      | undefined,
    title,
    topic,
    topic_label: asString(course.topic_label) || topic,
    description: asString(course.description),
    little_description: asString(course.little_description) || undefined,
    duration: formatDuration(course, term),
    level,
    level_label: asString(course.level_label) || level,
    age_group: ageGroupId as CourseAgeGroup,
    age_group_label: ageGroupLabel || '—',
    price_type: normalizePriceType(course.price_type),
    price,
    price_label: asString(course.price_label) || price.toLocaleString('fa-IR'),
    image: image || undefined,
    video: video || undefined,
    rating: firstDefined(course.rating, pageContent.rating, 0) as
      | number
      | string
      | null,
    rating_count: asNumber(
      firstDefined(course.rating_count, pageContent.rating_count)
    ),
    student_count: asNumber(course.student_count),
    is_popular: parseCoursePublished(course.is_popular),
    is_published: pageContent.is_published,
    created_at:
      asString(firstDefined(course.created_at, term.created_at)) || undefined,
    page_content: pageContent,
    instructor: normalizeInstructor(
      firstDefined(course.instructor, course.teacher)
    ),
    schedule: asArray(course.schedule)
      .map(asRecord)
      .map((session) => ({
        day: asString(session.day),
        time: asString(session.time),
        duration: asString(session.duration),
      })),
    prerequisites: normalizeStringArray(course.prerequisites),
    what_you_will_learn: normalizeStringArray(course.what_you_will_learn),
  };
}

export function normalizeAdminCourse(value: unknown): CoursePageContent {
  const course = asRecord(value);
  return normalizeCoursePageContent(course.page_content ?? course, course);
}

export function getCourseLevelLabel(
  level: CourseLevel,
  direction: 'rtl' | 'ltr'
): string {
  const labels =
    direction === 'rtl'
      ? { beginner: 'مقدماتی', intermediate: 'متوسط', advanced: 'پیشرفته' }
      : {
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
        };
  return labels[level];
}
