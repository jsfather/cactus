'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  BarChart,
  ChevronLeft,
  Phone,
} from 'lucide-react';
import { useLocale } from '@/app/contexts/LocaleContext';
import { publicCourseService } from '@/app/lib/services/public-course.service';
import { PublicCourseDetail } from '@/app/lib/types/course';
import CourseRating from '@/app/components/courses/CourseRating';
import CourseFAQSection from '@/app/components/courses/CourseFAQSection';
import VideoTestimonialSlider from '@/app/components/courses/VideoTestimonialSlider';
import CourseSyllabus from '@/app/components/courses/CourseSyllabus';
import {
  RelatedArticles,
  RecommendedTools,
  CourseVideoEmbed,
} from '@/app/components/courses/CourseSections';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Button } from '@/app/components/ui/Button';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { t, dir } = useLocale();
  const [course, setCourse] = useState<PublicCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await publicCourseService.getById(resolvedParams.id);
        setCourse(response.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [resolvedParams.id]);

  if (loading) return <LoadingSpinner />;

  if (error || !course) {
    return (
      <div dir={dir} className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <p className="mb-4 text-xl text-gray-600 dark:text-gray-400">
            {t.courses.detail.notFound}
          </p>
          <Link href="/courses" className="text-primary-600 hover:underline">
            {t.courses.detail.backToList}
          </Link>
        </div>
      </div>
    );
  }

  const { page_content: content } = course;
  const priceDisplay =
    course.price_type === 'free'
      ? t.courses.filters.prices.free
      : `${course.price_label} ${t.common.toman}`;

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <div className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex items-center py-4 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              {t.common.home}
            </Link>
            <ChevronLeft className="mx-2 h-4 w-4 text-gray-500" />
            <Link
              href="/courses"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              {t.courses.pageTitle}
            </Link>
            <ChevronLeft className="mx-2 h-4 w-4 text-gray-500" />
            <span className="text-primary-600 dark:text-primary-400">
              {course.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <CourseRating
                rating={content.rating ?? course.rating}
                ratingCount={content.rating_count ?? course.rating_count}
              />
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                {course.topic_label}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                {course.age_group_label}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>

            {content.intro_video_url ? (
              <CourseVideoEmbed
                title={t.courses.detail.introVideo}
                videoUrl={content.intro_video_url}
              />
            ) : (
              <div className="relative mb-8 h-[400px] overflow-hidden rounded-2xl">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {content.supplementary_description && (
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                {content.supplementary_description}
              </p>
            )}

            <div className="mb-8 grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-6 md:grid-cols-3 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <BarChart className="text-primary-600 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.courses.level}
                  </p>
                  <p className="font-bold">{course.level_label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-primary-600 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.courses.duration}
                  </p>
                  <p className="font-bold">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-primary-600 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.courses.detail.studentCount}
                  </p>
                  <p className="font-bold">
                    {course.student_count ?? 0} {t.courses.detail.people}
                  </p>
                </div>
              </div>
            </div>

            {course.schedule && course.schedule.length > 0 && (
              <div className="mb-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold">
                  {t.courses.detail.schedule}
                </h2>
                <div className="space-y-4">
                  {course.schedule.map((session, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Calendar className="text-primary-600 h-5 w-5" />
                      <span className="font-bold">{session.day}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {t.courses.detail.time} {session.time} —{' '}
                        {session.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert mb-8 max-w-none">
              <h2>{t.courses.detail.description}</h2>
              <p>{course.description}</p>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <>
                  <h3>{t.courses.detail.prerequisites}</h3>
                  <ul>
                    {course.prerequisites.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {course.what_you_will_learn &&
                course.what_you_will_learn.length > 0 && (
                  <>
                    <h3>{t.courses.detail.whatYouLearn}</h3>
                    <ul>
                      {course.what_you_will_learn.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
            </div>

            <CourseSyllabus sections={content.syllabus} />
            <VideoTestimonialSlider testimonials={content.video_testimonials} />

            <CourseVideoEmbed
              title={t.courses.detail.certificateVideo}
              videoUrl={content.certificate_video_url}
            />

            {course.instructor && (
              <div className="mb-12 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
                <h2 className="mb-6 text-xl font-bold">
                  {t.courses.detail.courseInstructor}
                </h2>
                <div className="flex items-start gap-4">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={80}
                    height={80}
                    className="rounded-xl"
                  />
                  <div>
                    <h3 className="mb-2 text-xl font-bold">
                      {course.instructor.name}
                    </h3>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                      {course.instructor.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {course.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <RecommendedTools tools={content.recommended_tools} />
            <CourseFAQSection faqs={content.faqs} />
            <RelatedArticles tags={content.related_blog_tags} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <div className="mb-6 text-center">
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  {t.courses.detail.price}
                </p>
                <p className="text-primary-600 text-3xl font-bold">
                  {priceDisplay}
                </p>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-primary-600 h-5 w-5" />
                  <span>{t.courses.detail.accessToAllSessions}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-primary-600 h-5 w-5" />
                  <span>{t.courses.detail.certificateBenefit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-primary-600 h-5 w-5" />
                  <span>{t.courses.detail.onlineSupport}</span>
                </div>
              </div>

              <Link href="/send-otp">
                <button className="bg-primary-600 hover:bg-primary-700 mb-3 w-full rounded-lg px-6 py-3 text-center text-white transition-colors">
                  {t.courses.detail.enroll}
                </button>
              </Link>

              <Link href="/about">
                <Button
                  variant="secondary"
                  className="flex w-full items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {t.courses.detail.consultation}
                </Button>
              </Link>

              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                {t.courses.detail.guarantee}
              </p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
