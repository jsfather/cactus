'use client';

import { useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  BookOpen,
  ClipboardList,
  FileText,
  MessageSquare,
  Settings,
  Plus,
  UserCheck,
  UserX,
  AlertCircle,
} from 'lucide-react';
import { useTeacherDashboard } from '@/app/lib/hooks/use-teacher-dashboard';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const {
    stats,
    recentActivities,
    upcomingClasses,
    terms,
    loading,
    fetchAllData,
  } = useTeacherDashboard();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const dashboardStats = [
    {
      title: 'کل دانش‌آموزان',
      value: stats.totalStudents.toLocaleString('fa-IR'),
      change: `+${((stats.studentsWithProfile / stats.totalStudents) * 100).toFixed(0)}٪`,
      trend: 'up' as const,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'ترم‌های فعال',
      value: stats.activeTerms.toLocaleString('fa-IR'),
      change: `${stats.totalTerms} کل`,
      trend: stats.activeTerms > 0 ? ('up' as const) : ('down' as const),
      icon: <GraduationCap className="h-6 w-6" />,
    },
    {
      title: 'تکالیف فعال',
      value: stats.totalHomeworks.toLocaleString('fa-IR'),
      change: `${stats.recentHomeworks} جدید`,
      trend: stats.recentHomeworks > 0 ? ('up' as const) : ('down' as const),
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      title: 'تیکت‌های باز',
      value: stats.openTickets.toLocaleString('fa-IR'),
      change: `${stats.totalTickets} کل`,
      trend: stats.openTickets > 0 ? ('down' as const) : ('up' as const),
      icon: <MessageSquare className="h-6 w-6" />,
    },
  ];

  const quickActionsWithRoutes = [
    {
      text: 'ثبت حضور و غیاب',
      icon: ClipboardList,
      route: '/teacher/attendances',
    },
    { text: 'مدیریت تکالیف', icon: FileText, route: '/teacher/homeworks' },
    { text: 'برنامه ترم‌ها', icon: Calendar, route: '/teacher/terms' },
    { text: 'لیست دانش‌آموزان', icon: Users, route: '/teacher/students' },
    { text: 'گزارش‌ها', icon: FileText, route: '/teacher/reports' },
    { text: 'تیکت‌ها', icon: MessageSquare, route: '/teacher/tickets' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'homework':
        return <BookOpen className="h-5 w-5" />;
      case 'report':
        return <FileText className="h-5 w-5" />;
      case 'ticket':
        return <MessageSquare className="h-5 w-5" />;
      case 'enrollment':
        return <Users className="h-5 w-5" />;
      case 'attendance':
        return <ClipboardList className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          داشبورد استاد
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>آخرین بروزرسانی: ۵ دقیقه پیش</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 dark:text-red-400" />
                )}
                <span
                  className={`text-sm ${
                    stat.trend === 'up'
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full p-3">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Activity */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              فعالیت‌های اخیر
            </h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={`${activity.title}-${index}`}
                    className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-700"
                  >
                    <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full p-2">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                    <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    هنوز فعالیت اخیری وجود ندارد
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    با شروع کار با سیستم، فعالیت‌های شما اینجا نمایش داده می‌شود
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Terms Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                ترم‌های فعال
              </h2>
              <button
                onClick={() => router.push('/teacher/terms')}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              >
                <Plus className="h-4 w-4" />
                <span>مشاهده ترم‌ها</span>
              </button>
            </div>
            <div className="space-y-4">
              {terms.length > 0 ? (
                terms.map((term) => {
                  const today = new Date();
                  const startDate = new Date(
                    term.start_date.replace(/\//g, '-')
                  );
                  const endDate = new Date(term.end_date.replace(/\//g, '-'));
                  const totalDuration = endDate.getTime() - startDate.getTime();
                  const elapsedDuration = today.getTime() - startDate.getTime();
                  const progress = Math.max(
                    0,
                    Math.min(100, (elapsedDuration / totalDuration) * 100)
                  );
                  const isActive = today >= startDate && today <= endDate;
                  const studentsCount =
                    term.students?.filter((s) => s.user).length || 0;

                  return (
                    <div
                      key={term.id}
                      className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {term.title}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : today < startDate
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}
                        >
                          {isActive
                            ? 'فعال'
                            : today < startDate
                              ? 'در انتظار'
                              : 'پایان یافته'}
                        </span>
                      </div>
                      <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            تعداد دانش‌آموزان
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {studentsCount} نفر
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            تاریخ شروع
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {term.start_date}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            تاریخ پایان
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {term.end_date}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            پیشرفت ترم
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-green-600 dark:bg-green-500"
                            style={{ width: `${Math.round(progress)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                    <GraduationCap className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    هنوز ترمی تعریف نشده است
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    برای شروع، ابتدا ترم‌های خود را تعریف کنید
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              دسترسی سریع
            </h2>
            <div className="space-y-3">
              {quickActionsWithRoutes.map((action, index) => (
                <button
                  key={action.text}
                  onClick={() => router.push(action.route)}
                  className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 flex w-full items-center justify-between rounded-lg p-3 transition-colors"
                >
                  <span>{action.text}</span>
                  <action.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              کلاس‌های امروز
            </h2>
            <div className="space-y-4">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((upcomingClass, index) => (
                  <div
                    key={`${upcomingClass.title}-${index}`}
                    className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {upcomingClass.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {upcomingClass.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {upcomingClass.location}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-gray-100 p-4 text-center dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    کلاس فعالی برای امروز برنامه‌ریزی نشده است
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
