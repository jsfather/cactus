'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  ArrowRight,
} from 'lucide-react';
import { publicTeacherService } from '@/app/lib/services/public-teacher.service';
import { Teacher } from '@/app/lib/types/teacher';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useLocale } from '@/app/contexts/LocaleContext';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { t, dir } = useLocale();
  const resolvedParams = use(params);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await publicTeacherService.getHomeTeachers();

        // Filter to find the specific teacher by user_id
        const foundTeacher = response.data.find(
          (t) => t.user_id === parseInt(resolvedParams.id)
        );

        if (foundTeacher && foundTeacher.user) {
          setTeacher(foundTeacher);
        } else {
          setError('مدرس یافت نشد');
        }
      } catch (err) {
        setError('خطا در دریافت اطلاعات مدرس');
        console.error('Error fetching teacher:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [resolvedParams.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !teacher) {
    return (
      <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">
            {error || 'مدرس یافت نشد'}
          </h1>
          <Link
            href="/teachers"
            className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2"
          >
            <ArrowRight className="h-5 w-5" />
            بازگشت به لیست مدرسان
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${teacher.user.first_name} ${teacher.user.last_name}`;
  const profilePicture = teacher.user.profile_picture
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${teacher.user.profile_picture}`
    : null;

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-12 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/teachers"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به لیست مدرسان
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
                <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  {profilePicture ? (
                    <Image
                      src={profilePicture}
                      alt={fullName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h1 className="mb-4 text-2xl font-bold">{fullName}</h1>

                  {/* Basic Info */}
                  <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                    {teacher.city && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>{teacher.city}</span>
                      </div>
                    )}
                    {teacher.member_since && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>عضویت از {teacher.member_since}</span>
                      </div>
                    )}
                    {teacher.user.email && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-gray-400">ایمیل:</span>
                        <span className="break-all">{teacher.user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="space-y-8">
                {/* Bio Section */}
                {teacher.bio && (
                  <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-bold">درباره مدرس</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                        {teacher.bio}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* About Me Section */}
                {teacher.about_me && (
                  <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-bold">معرفی تکمیلی</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                        {teacher.about_me}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {teacher.skills && teacher.skills.length > 0 && (
                  <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                      <Star className="h-6 w-6" />
                      مهارت‌ها
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {teacher.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-semibold">{skill.name}</span>
                            <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                              {skill.score}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="bg-primary-600 dark:bg-primary-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${skill.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience Section */}
                {teacher.work_experiences &&
                  teacher.work_experiences.length > 0 && (
                    <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                        <Briefcase className="h-6 w-6" />
                        سوابق کاری
                      </h2>
                      <div className="space-y-4">
                        {teacher.work_experiences.map((exp, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                          >
                            <h3 className="mb-1 font-bold">{exp.role}</h3>
                            <p className="text-primary-600 dark:text-primary-400 mb-2 text-sm">
                              {exp.company}
                            </p>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              {exp.years}
                            </p>
                            {exp.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Education Section */}
                {teacher.educations && teacher.educations.length > 0 && (
                  <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                      <GraduationCap className="h-6 w-6" />
                      تحصیلات
                    </h2>
                    <div className="space-y-4">
                      {teacher.educations.map((edu, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                        >
                          <h3 className="mb-1 font-bold">{edu.degree}</h3>
                          <p className="text-primary-600 dark:text-primary-400 mb-2 text-sm">
                            {edu.university}
                          </p>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            سال فارغ‌التحصیلی: {edu.year}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements Section */}
                {teacher.achievements && (
                  <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                      <Award className="h-6 w-6" />
                      افتخارات و دستاوردها
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                        {teacher.achievements}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
