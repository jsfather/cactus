'use client';

import { useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useTeacherDashboard } from '@/app/lib/hooks/use-teacher-dashboard';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  DashboardEmptyState,
  DashboardHeader,
  DashboardQuickActions,
  DashboardSection,
  DashboardStatCard,
  type DashboardAction,
} from '@/app/components/dashboard/DashboardUI';

const quickActions: DashboardAction[] = [
  {
    title: 'ثبت حضور و غیاب',
    description: 'ثبت وضعیت دانش‌پژوهان هر جلسه',
    href: '/teacher/attendances',
    icon: ClipboardList,
    tone: 'emerald',
  },
  {
    title: 'مدیریت تکالیف',
    description: 'ایجاد تکلیف و بررسی پاسخ‌ها',
    href: '/teacher/homeworks',
    icon: FileText,
    tone: 'purple',
  },
  {
    title: 'برنامه ترم‌ها',
    description: 'مشاهده کلاس‌ها و جلسات آینده',
    href: '/teacher/terms',
    icon: Calendar,
    tone: 'blue',
  },
  {
    title: 'دانش‌پژوهان',
    description: 'مشاهده اطلاعات آموزشی فراگیران',
    href: '/teacher/students',
    icon: Users,
    tone: 'amber',
  },
  {
    title: 'گزارش‌ها',
    description: 'ثبت و مشاهده گزارش جلسات',
    href: '/teacher/reports',
    icon: BookOpen,
    tone: 'emerald',
  },
  {
    title: 'تیکت‌ها',
    description: 'پیگیری پیام‌های پشتیبانی',
    href: '/teacher/tickets',
    icon: MessageSquare,
    tone: 'blue',
  },
];

export default function TeacherDashboardPage() {
  const { stats, recentActivities, upcomingClasses, loading, fetchAllData } =
    useTeacherDashboard();

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

  return (
    <div className="min-w-0 space-y-6">
      <DashboardHeader
        title="داشبورد مدرس"
        description="خلاصه اطلاعات واقعی ترم‌ها، دانش‌پژوهان و فعالیت‌های آموزشی"
        onRefresh={fetchAllData}
        refreshing={loading}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="دانش‌پژوهان"
          value={stats.totalStudents.toLocaleString('fa-IR')}
          hint={`${stats.studentsWithProfile.toLocaleString('fa-IR')} پرونده کامل`}
          icon={Users}
          tone="blue"
        />
        <DashboardStatCard
          label="ترم‌های فعال"
          value={stats.activeTerms.toLocaleString('fa-IR')}
          hint={`از ${stats.totalTerms.toLocaleString('fa-IR')} ترم`}
          icon={GraduationCap}
          tone="purple"
        />
        <DashboardStatCard
          label="تکلیف‌ها"
          value={stats.totalHomeworks.toLocaleString('fa-IR')}
          hint={`${stats.homeworksAnsweredCount.toLocaleString('fa-IR')} دارای پاسخ`}
          icon={BookOpen}
          tone="emerald"
        />
        <DashboardStatCard
          label="تیکت‌های باز"
          value={stats.openTickets.toLocaleString('fa-IR')}
          hint={`از ${stats.totalTickets.toLocaleString('fa-IR')} تیکت`}
          icon={MessageSquare}
          tone="amber"
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <DashboardSection title="فعالیت‌های اخیر">
            {recentActivities.length === 0 ? (
              <DashboardEmptyState message="هنوز فعالیت آموزشی ثبت نشده است." />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentActivities.map((activity, index) => (
                  <div
                    key={`${activity.type}-${activity.time}-${index}`}
                    className="flex min-w-0 items-start gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="shrink-0 rounded-full bg-gray-100 p-2 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="mt-0.5 text-sm break-words text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardSection>
        </div>

        <DashboardSection title="کلاس‌های پیش رو">
          {upcomingClasses.length === 0 ? (
            <DashboardEmptyState message="کلاس آینده‌ای در برنامه ثبت نشده است." />
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((upcomingClass, index) => (
                <div
                  key={`${upcomingClass.termId}-${index}`}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {upcomingClass.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {upcomingClass.date}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {upcomingClass.time}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>
      </div>

      <DashboardSection title="دسترسی سریع">
        <DashboardQuickActions actions={quickActions} />
      </DashboardSection>
    </div>
  );
}
