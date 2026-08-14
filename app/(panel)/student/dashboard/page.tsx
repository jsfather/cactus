'use client';

import {
  BookOpenCheck,
  BookType,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  ShoppingCart,
  Ticket,
  UserCheck,
} from 'lucide-react';
import { useStudentDashboard } from '@/app/lib/hooks/use-student-dashboard';
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
    title: 'ترم‌های من',
    description: 'مشاهده کلاس‌ها و برنامه ترم',
    href: '/student/terms',
    icon: BookType,
    tone: 'blue',
  },
  {
    title: 'تکلیف‌ها',
    description: 'بررسی و ارسال پاسخ تکالیف',
    href: '/student/homeworks',
    icon: BookOpenCheck,
    tone: 'purple',
  },
  {
    title: 'حضور و غیاب',
    description: 'مشاهده وضعیت جلسات برگزارشده',
    href: '/student/attendances',
    icon: UserCheck,
    tone: 'emerald',
  },
  {
    title: 'پشتیبانی',
    description: 'ارسال یا پیگیری تیکت',
    href: '/student/tickets',
    icon: Ticket,
    tone: 'amber',
  },
  {
    title: 'سفارش‌ها',
    description: 'مشاهده وضعیت خریدها',
    href: '/student/orders',
    icon: ShoppingCart,
    tone: 'blue',
  },
];

export default function StudentDashboardPage() {
  const { stats, recentActivities, upcomingSessions, loading, fetchAllData } =
    useStudentDashboard();

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
        title="داشبورد دانش‌پژوه"
        description="خلاصه اطلاعات واقعی کلاس‌ها، تکالیف و پشتیبانی شما"
        onRefresh={fetchAllData}
        refreshing={loading}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="ترم‌های فعال"
          value={stats.activeTerms.toLocaleString('fa-IR')}
          hint={`از ${stats.totalTerms.toLocaleString('fa-IR')} ترم ثبت‌شده`}
          icon={BookType}
          tone="blue"
        />
        <DashboardStatCard
          label="تکلیف‌ها"
          value={stats.totalHomeworks.toLocaleString('fa-IR')}
          hint={`${stats.pendingHomeworks.toLocaleString('fa-IR')} تکلیف بدون پاسخ`}
          icon={BookOpenCheck}
          tone="purple"
        />
        <DashboardStatCard
          label="نرخ حضور"
          value={`${stats.attendanceRate.toLocaleString('fa-IR')}٪`}
          hint="بر اساس جلسات برگزارشده و غیبت‌های ثبت‌شده"
          icon={ClipboardCheck}
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
              <DashboardEmptyState message="هنوز فعالیتی برای نمایش وجود ندارد." />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex min-w-0 items-start gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="shrink-0 rounded-full bg-gray-100 p-2 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
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

        <DashboardSection title="جلسات پیش رو">
          {upcomingSessions.length === 0 ? (
            <DashboardEmptyState message="جلسه آینده‌ای ثبت نشده است." />
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.termTitle}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {session.sessionDate}، {session.startTime.slice(0, 5)} تا{' '}
                    {session.endTime.slice(0, 5)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    مدرس: {session.teacher}
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
