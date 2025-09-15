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
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile?.profile_picture ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/20">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${profile.profile_picture}`}
                  alt="تصویر پروفایل"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              خوش آمدید{profile?.first_name ? `, ${profile.first_name} ${profile.last_name}` : ''}!
            </h1>
            <p className="text-blue-100 dark:text-blue-200">
              به پنل کاربری خود خوش آمدید
            </p>
          </div>
        </div>
      </div>

      {/* Profile Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              اطلاعات شخصی
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {profile?.username || 'تعریف نشده'}
              </span>
            </div>
            
            {profile?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300" dir="ltr">
                  {profile.phone}
                </span>
              </div>
            )}
            
            {profile?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300" dir="ltr">
                  {profile.email}
                </span>
              </div>
            )}
            
            {profile?.national_code && (
              <div className="flex items-center gap-2 text-sm">
                <IdCard className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300" dir="ltr">
                  {profile.national_code}
                </span>
              </div>
            )}
          </div>

          <Link
            href="/user/profile"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Edit className="w-4 h-4" />
            ویرایش اطلاعات
          </Link>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              عملیات سریع
            </h3>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/user/profile"
              className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ویرایش پروفایل
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                بروزرسانی اطلاعات شخصی
              </p>
            </Link>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                {profile?.role === 'admin' ? 'مدیر' : 
                 profile?.role === 'teacher' ? 'مدرس' : 
                 profile?.role === 'student' ? 'دانش‌آموز' : 'کاربر'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                وضعیت:
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                فعال
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
