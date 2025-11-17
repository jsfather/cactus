'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Calendar, Award, User } from 'lucide-react';
import { usePublicTeacher } from '@/app/lib/hooks/use-public-teacher';
import { useLocale } from '@/app/contexts/LocaleContext';

export default function Page() {
  const { t, dir } = useLocale();
  const { teachers, loading, error, fetchHomeTeachers } = usePublicTeacher();

  useEffect(() => {
    fetchHomeTeachers();
  }, [fetchHomeTeachers]);
  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold">
              {t.teachers.pageTitle}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.teachers.pageTitleHighlight}
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              {t.teachers.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800">
                    <div className="mb-4 aspect-video rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-3">
                      <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && teachers.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {t.teachers.noInstructors}
            </div>
          )}

          {!loading && !error && teachers.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teachers.map((teacher, index) => {
                const fullName = teacher.user
                  ? `${teacher.user.first_name} ${teacher.user.last_name}`
                  : 'نام نامشخص';
                const profilePicture = teacher.user?.profile_picture
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${teacher.user.profile_picture}`
                  : null;
                const skills = teacher.skills || [];
                const topSkills = skills.slice(0, 3);
                const hasAdditionalInfo =
                  teacher.city || teacher.member_since || teacher.achievements;

                return (
                  <motion.div
                    key={teacher.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
                      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
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
                        <h2 className="mb-2 text-xl font-bold">{fullName}</h2>
                        {teacher.bio && (
                          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                            {teacher.bio}
                          </p>
                        )}

                        {/* Skills */}
                        {topSkills.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {topSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-3 py-1 text-sm"
                              >
                                {skill.name}
                              </span>
                            ))}
                            {skills.length > 3 && (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                +{skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Additional Info */}
                        {hasAdditionalInfo && (
                          <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                            {teacher.city && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4" />
                                <span>{teacher.city}</span>
                              </div>
                            )}
                            {teacher.member_since && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {t.teachers.memberSince}{' '}
                                  {teacher.member_since}
                                </span>
                              </div>
                            )}
                            {teacher.achievements && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Award className="h-4 w-4" />
                                <span className="line-clamp-1">
                                  {teacher.achievements}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
