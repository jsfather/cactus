'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useProfile } from '@/app/lib/hooks/use-profile';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { User, Settings, Edit, Phone, Mail, IdCard } from 'lucide-react';
import Image from 'next/image';

export default function UserDashboard() {
  const { profile, loading, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white dark:from-blue-700 dark:to-purple-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile?.profile_picture ? (
              <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white/20">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${profile.profile_picture}`}
                  alt="تصویر پروفایل"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              خوش آمدید
              {profile?.first_name
                ? `, ${profile.first_name} ${profile.last_name}`
                : ''}
              !
            </h1>
            <p className="text-blue-100 dark:text-blue-200">
              به پنل کاربری خود خوش آمدید
            </p>
          </div>
        </div>
      </div>

      {/* Profile Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Info Card */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              اطلاعات شخصی
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {profile?.username || 'تعریف نشده'}
              </span>
            </div>

            {profile?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300" dir="ltr">
                  {profile.phone}
                </span>
              </div>
            )}

            {profile?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300" dir="ltr">
                  {profile.email}
                </span>
              </div>
            )}

            {profile?.national_code && (
              <div className="flex items-center gap-2 text-sm">
                <IdCard className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300" dir="ltr">
                  {profile.national_code}
                </span>
              </div>
            )}
          </div>

          <Link
            href="/user/profile"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Edit className="h-4 w-4" />
            ویرایش اطلاعات
          </Link>
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
              <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              عملیات سریع
            </h3>
          </div>

          <div className="space-y-3">
            <Link
              href="/user/profile"
              className="block rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ویرایش پروفایل
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                بروزرسانی اطلاعات شخصی
              </p>
            </Link>
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              وضعیت حساب
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                نقش کاربری:
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {profile?.role === 'admin'
                  ? 'مدیر'
                  : profile?.role === 'teacher'
                    ? 'مدرس'
                    : profile?.role === 'student'
                      ? 'دانش‌پژوه'
                      : 'کاربر'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                وضعیت:
              </span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                فعال
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
