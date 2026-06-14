import {
  PublicCourse,
  PublicCourseDetail,
  CoursePageContent,
  CourseListParams,
} from '@/app/lib/types/course';

export const MOCK_COURSE_PAGES: CoursePageContent[] = [
  {
    id: 1,
    term_id: 1,
    course_id: 1,
    title: 'مقدمات رباتیک',
    supplementary_description:
      'در این دوره با اصول پایه رباتیک، الکترونیک و برنامه‌نویسی آشنا می‌شوید و اولین ربات خود را می‌سازید.',
    intro_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    certificate_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    faqs: [
      {
        id: 1,
        question: 'این دوره برای چه سنی مناسب است؟',
        answer:
          'این دوره برای دانش‌آموزان ۱۰ تا ۱۴ سال طراحی شده است. پیش‌نیاز خاصی ندارد.',
      },
      {
        id: 2,
        question: 'آیا مدرک معتبر دریافت می‌کنم؟',
        answer:
          'بله، پس از اتمام موفقیت‌آمیز دوره و قبولی در آزمون نهایی، مدرک معتبر آکادمی کاکتوس صادر می‌شود.',
      },
      {
        id: 3,
        question: 'کلاس‌ها به چه صورت برگزار می‌شود؟',
        answer:
          'کلاس‌ها به صورت آنلاین و حضوری برگزار می‌شود. ضبط جلسات در اختیار دانشجویان قرار می‌گیرد.',
      },
    ],
    video_testimonials: [
      {
        id: 1,
        student_name: 'علی رضایی',
        title: 'تجربه یادگیری در کاکتوس',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail_url: '/course-robotics-intro.png',
      },
      {
        id: 2,
        student_name: 'سارا محمدی',
        title: 'از صفر تا ساخت ربات',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail_url: '/course-robot-programming.png',
      },
      {
        id: 3,
        student_name: 'امیر حسینی',
        title: 'بهترین دوره رباتیک',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail_url: '/course-robot-vision.png',
      },
    ],
    syllabus: [
      {
        id: 1,
        title: 'فصل اول: آشنایی با رباتیک',
        items: [
          'تاریخچه و کاربردهای رباتیک',
          'انواع ربات‌ها و اجزای اصلی',
          'ایمنی در کار با تجهیزات',
        ],
      },
      {
        id: 2,
        title: 'فصل دوم: الکترونیک پایه',
        items: [
          'آشنایی با Arduino',
          'سنسورها و عملگرها',
          'مدارهای ساده',
        ],
      },
      {
        id: 3,
        title: 'فصل سوم: برنامه‌نویسی',
        items: [
          'مقدمات C++ در Arduino IDE',
          'کنترل LED و موتور',
          'پروژه نهایی: ربات خط‌یاب',
        ],
      },
    ],
    related_blog_tags: ['رباتیک', 'آموزش'],
    recommended_tools: [
      {
        id: 1,
        name: 'Arduino IDE',
        description: 'محیط برنامه‌نویسی میکروکنترلر Arduino',
        link: 'https://www.arduino.cc/en/software',
        icon: '🔧',
      },
      {
        id: 2,
        name: 'Tinkercad',
        description: 'شبیه‌ساز آنلاین مدار و رباتیک',
        link: 'https://www.tinkercad.com',
        icon: '⚡',
      },
    ],
    rating: 4.8,
    rating_count: 124,
    is_published: true,
  },
  {
    id: 2,
    term_id: 2,
    course_id: 2,
    title: 'برنامه‌نویسی پیشرفته ربات',
    supplementary_description:
      'یادگیری برنامه‌نویسی پیشرفته برای کنترل ربات‌های صنعتی و هوشمند.',
    intro_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    certificate_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    faqs: [
      {
        id: 1,
        question: 'پیش‌نیاز این دوره چیست؟',
        answer: 'آشنایی با مفاهیم پایه رباتیک و برنامه‌نویسی الزامی است.',
      },
    ],
    video_testimonials: [
      {
        id: 1,
        student_name: 'مریم کریمی',
        title: 'دوره عالی برای پیشرفت',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail_url: '/course-robot-programming.png',
      },
    ],
    syllabus: [
      {
        id: 1,
        title: 'فصل اول: ROS و سیستم‌های رباتیک',
        items: ['مقدمه ROS', 'Node و Topic', 'پیاده‌سازی اولین ربات'],
      },
    ],
    related_blog_tags: ['برنامه‌نویسی'],
    recommended_tools: [
      {
        id: 1,
        name: 'ROS',
        description: 'سیستم عامل رباتیک',
        link: 'https://www.ros.org',
        icon: '🤖',
      },
    ],
    rating: 4.6,
    rating_count: 89,
    is_published: true,
  },
  {
    id: 3,
    term_id: 3,
    course_id: 3,
    title: 'سیستم‌های بینایی ربات',
    supplementary_description:
      'آموزش پردازش تصویر و بینایی ماشین برای ربات‌های هوشمند.',
    intro_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    certificate_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    faqs: [
      {
        id: 1,
        question: 'آیا نیاز به دانش ریاضی پیشرفته دارم؟',
        answer: 'آشنایی با جبر خطی مفید است اما در دوره آموزش داده می‌شود.',
      },
    ],
    video_testimonials: [],
    syllabus: [
      {
        id: 1,
        title: 'فصل اول: پردازش تصویر',
        items: ['OpenCV', 'تشخیص اشیاء', 'ردیابی حرکت'],
      },
    ],
    related_blog_tags: ['هوش مصنوعی'],
    recommended_tools: [
      {
        id: 1,
        name: 'OpenCV',
        description: 'کتابخانه پردازش تصویر',
        link: 'https://opencv.org',
        icon: '👁️',
      },
    ],
    rating: 4.9,
    rating_count: 56,
    is_published: true,
  },
];

export const MOCK_COURSES: PublicCourse[] = [
  {
    id: 1,
    term_id: 1,
    title: 'مقدمات رباتیک',
    description:
      'آشنایی با اصول پایه رباتیک، الکترونیک و ساخت اولین ربات. مناسب برای شروع مسیر یادگیری.',
    duration: '۸ هفته',
    level: 'beginner',
    level_label: 'مبتدی',
    topic: 'robotics',
    topic_label: 'رباتیک',
    age_group: '10-14',
    age_group_label: '۱۰ تا ۱۴ سال',
    price_type: 'paid',
    price: 2990000,
    price_label: '۲,۹۹۰,۰۰۰',
    image: '/course-robotics-intro.png',
    rating: 4.8,
    rating_count: 124,
    student_count: 320,
    is_popular: true,
  },
  {
    id: 2,
    term_id: 2,
    title: 'برنامه‌نویسی پیشرفته ربات',
    description:
      'یادگیری برنامه‌نویسی پیشرفته برای کنترل ربات‌های صنعتی و هوشمند با ROS.',
    duration: '۱۲ هفته',
    level: 'advanced',
    level_label: 'پیشرفته',
    topic: 'programming',
    topic_label: 'برنامه‌نویسی',
    age_group: '14-18',
    age_group_label: '۱۴ تا ۱۸ سال',
    price_type: 'paid',
    price: 4990000,
    price_label: '۴,۹۹۰,۰۰۰',
    image: '/course-robot-programming.png',
    rating: 4.6,
    rating_count: 89,
    student_count: 180,
    is_popular: true,
  },
  {
    id: 3,
    term_id: 3,
    title: 'سیستم‌های بینایی ربات',
    description:
      'آموزش پردازش تصویر و بینایی ماشین برای ربات‌های هوشمند با OpenCV.',
    duration: '۱۰ هفته',
    level: 'intermediate',
    level_label: 'متوسط',
    topic: 'ai',
    topic_label: 'هوش مصنوعی',
    age_group: '18+',
    age_group_label: '۱۸ سال به بالا',
    price_type: 'paid',
    price: 3990000,
    price_label: '۳,۹۹۰,۰۰۰',
    image: '/course-robot-vision.png',
    rating: 4.9,
    rating_count: 56,
    student_count: 95,
    is_popular: false,
  },
  {
    id: 4,
    term_id: 4,
    title: 'الکترونیک برای کودکان',
    description: 'آشنایی بازیگونه با قطعات الکترونیکی و مدارهای ساده.',
    duration: '۶ هفته',
    level: 'beginner',
    level_label: 'مبتدی',
    topic: 'electronics',
    topic_label: 'الکترونیک',
    age_group: '6-10',
    age_group_label: '۶ تا ۱۰ سال',
    price_type: 'free',
    price: 0,
    price_label: 'رایگان',
    image: '/course-robotics-intro.png',
    rating: 4.7,
    rating_count: 42,
    student_count: 210,
    is_popular: false,
  },
];

function getCourseDetail(course: PublicCourse): PublicCourseDetail {
  const pageContent = MOCK_COURSE_PAGES.find(
    (p) => String(p.course_id) === String(course.id) || String(p.term_id) === String(course.term_id)
  );

  return {
    ...course,
    page_content: pageContent || {
      id: 0,
      term_id: course.term_id || course.id,
      title: course.title,
      faqs: [],
      video_testimonials: [],
      syllabus: [],
      related_blog_tags: [],
      recommended_tools: [],
      is_published: true,
    },
    instructor: {
      id: '1',
      name: 'امیر محمدی',
      role: 'مدرس ارشد رباتیک',
      avatar: '/user-amirali.jpg',
      bio: 'مدرس ارشد آکادمی کاکتوس با ۱۰ سال سابقه تدریس رباتیک و برنامه‌نویسی',
    },
    schedule: [
      { day: 'شنبه', time: '۱۸:۰۰', duration: '۲ ساعت' },
      { day: 'سه‌شنبه', time: '۱۸:۰۰', duration: '۲ ساعت' },
    ],
    prerequisites: [
      'آشنایی مقدماتی با کامپیوتر',
      'داشتن لپ‌تاپ شخصی',
      'انگیزه بالا برای یادگیری',
    ],
    what_you_will_learn: [
      'مفاهیم پایه رباتیک',
      'کار با Arduino و سنسورها',
      'برنامه‌نویسی میکروکنترلر',
      'ساخت پروژه عملی',
    ],
  };
}

export function filterMockCourses(params?: CourseListParams): PublicCourse[] {
  let result = [...MOCK_COURSES];

  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topic_label.includes(q)
    );
  }

  if (params?.topic) {
    result = result.filter((c) => c.topic === params.topic);
  }

  if (params?.level) {
    result = result.filter((c) => c.level === params.level);
  }

  if (params?.age_group) {
    result = result.filter((c) => c.age_group === params.age_group);
  }

  if (params?.price_type) {
    result = result.filter((c) => c.price_type === params.price_type);
  }

  if (params?.sort === 'popular') {
    result.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
  } else {
    result.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return result;
}

export function getMockCourseById(id: string): PublicCourseDetail | null {
  const course = MOCK_COURSES.find((c) => String(c.id) === id);
  if (!course) return null;
  return getCourseDetail(course);
}

export function getMockCoursePageById(id: string): CoursePageContent | null {
  return MOCK_COURSE_PAGES.find((p) => String(p.id) === id) || null;
}

export function getMockCoursePageByTermId(termId: string): CoursePageContent | null {
  return MOCK_COURSE_PAGES.find((p) => String(p.term_id) === termId) || null;
}
