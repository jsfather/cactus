'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpenCheck,
  UserCheck,
  BookType,
  Clock,
  Calendar,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
} from 'lucide-react';
import { useStudentDashboard } from '@/app/lib/hooks/use-student-dashboard';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Button } from '@/app/components/ui/Button';

const Page = () => {
  const router = useRouter();
  const {
    stats,
    recentActivities,
    upcomingSessions,
    termList,
    availableTerms,
    loading,
    fetchAllData,
  } = useStudentDashboard();



  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-gray-200">
          داشبورد دانشجو
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
          <Clock className="h-4 w-4" />
          <span>آخرین بروزرسانی: ۵ دقیقه پیش</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Terms */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/5 opacity-0 transition-all group-hover:opacity-100" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ترم‌های فعال
              </p>
              <div className="rounded-full bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BookType className="h-6 w-6" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeTerms.toLocaleString('fa-IR')}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 dark:text-green-400" />
                <span className="text-sm font-medium text-green-500 dark:text-green-400">
                  {stats.totalTerms > 0 ? '+' + Math.round((stats.activeTerms / stats.totalTerms) * 100) + '%' : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Homework Stats */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-500/5 opacity-0 transition-all group-hover:opacity-100" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                کل تکالیف
              </p>
              <div className="rounded-full bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <BookOpenCheck className="h-6 w-6" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalHomeworks.toLocaleString('fa-IR')}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 dark:text-green-400" />
                <span className="text-sm font-medium text-green-500 dark:text-green-400">
                  در ترم‌های فعال
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-500/5 opacity-0 transition-all group-hover:opacity-100" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                نرخ حضور
              </p>
              <div className="rounded-full bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.attendanceRate.toLocaleString('fa-IR')}%
              </p>
              <div className="mt-1 flex items-center gap-1">
                {stats.attendanceRate >= 80 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 dark:text-red-400" />
                )}
                <span className={`text-sm font-medium ${stats.attendanceRate >= 80 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {stats.attendanceRate >= 80 ? 'عالی' : 'نیاز به بهبود'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-500/5 opacity-0 transition-all group-hover:opacity-100" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تیکت‌های باز
              </p>
              <div className="rounded-full bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Ticket className="h-6 w-6" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.openTickets.toLocaleString('fa-IR')}
              </p>
              <div className="mt-1 flex items-center gap-1">
                {stats.openTickets === 0 ? (
                  <ArrowDownRight className="h-4 w-4 text-green-500 dark:text-green-400" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                )}
                <span className={`text-sm font-medium ${stats.openTickets === 0 ? 'text-green-500 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'}`}>
                  از {stats.totalTickets.toLocaleString('fa-IR')} کل
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
            <div className="border-b border-gray-100 p-6 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                فعالیت‌های اخیر
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      فعالیت جدیدی وجود ندارد
                    </p>
                  </div>
                </div>
              ) : (
                recentActivities.map((activity, index) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case 'homework':
                        return <BookOpenCheck className="h-5 w-5" />;
                      case 'attendance':
                        return <UserCheck className="h-5 w-5" />;
                      case 'ticket':
                        return <Ticket className="h-5 w-5" />;
                      case 'term':
                        return <BookType className="h-5 w-5" />;
                      case 'order':
                        return <Calendar className="h-5 w-5" />;
                      default:
                        return <Calendar className="h-5 w-5" />;
                    }
                  };

                  const color = activity.color;

                  return (
                    <div
                      key={index}
                      className="group relative overflow-hidden p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all group-hover:opacity-[0.03]"
                        style={{
                          backgroundImage:
                            color === 'blue'
                              ? 'linear-gradient(to right, transparent, #60a5fa)'
                              : color === 'purple'
                                ? 'linear-gradient(to right, transparent, #a78bfa)'
                                : color === 'emerald'
                                  ? 'linear-gradient(to right, transparent, #34d399)'
                                  : 'linear-gradient(to right, transparent, #fbbf24)',
                        }}
                      />
                      <div className="flex items-start gap-4">
                        <div
                          className={`shrink-0 rounded-full p-2 ${
                            color === 'blue'
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : color === 'purple'
                                ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                : color === 'emerald'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                        >
                          {getActivityIcon()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {activity.description}
                          </p>
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
            <div className="border-b border-gray-100 p-6 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                دسترسی سریع
              </h2>
            </div>
            <div className="space-y-2 p-4">
              <button
                onClick={() => router.push('/student/terms')}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/10 opacity-0 transition-all group-hover:opacity-100" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  ترم‌های من
                </span>
                <div className="text-blue-600 dark:text-blue-400">
                  <BookType className="h-5 w-5" />
                </div>
              </button>

              <button
                onClick={() => router.push('/student/homeworks')}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-500/10 opacity-0 transition-all group-hover:opacity-100" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  تکلیف‌ها
                </span>
                <div className="text-purple-600 dark:text-purple-400">
                  <BookOpenCheck className="h-5 w-5" />
                </div>
              </button>

              <button
                onClick={() => router.push('/student/attendances')}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-500/10 opacity-0 transition-all group-hover:opacity-100" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  حضور و غیاب
                </span>
                <div className="text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="h-5 w-5" />
                </div>
              </button>

              <button
                onClick={() => router.push('/student/tickets')}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-500/10 opacity-0 transition-all group-hover:opacity-100" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  پشتیبانی
                </span>
                <div className="text-amber-600 dark:text-amber-400">
                  <Ticket className="h-5 w-5" />
                </div>
              </button>

              <button
                onClick={() => router.push('/student/orders')}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-indigo-500/10 opacity-0 transition-all group-hover:opacity-100" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  سفارش‌ها
                </span>
                <div className="text-indigo-600 dark:text-indigo-400">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
