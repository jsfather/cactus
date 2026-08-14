'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  FileEdit,
  GraduationCap,
  MessageSquare,
  Package,
  UserPlus,
  Users,
} from 'lucide-react';
import { apiClient, type ApiError } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  DashboardHeader,
  DashboardQuickActions,
  DashboardSection,
  DashboardStatCard,
  type DashboardAction,
} from '@/app/components/dashboard/DashboardUI';

interface AdminDashboardData {
  students: number;
  terms: number;
  blogs: number;
  tickets: number;
}

const quickActions: DashboardAction[] = [
  {
    title: 'افزودن دانش‌پژوه',
    description: 'ایجاد پرونده دانش‌پژوه جدید',
    href: '/admin/students/new',
    icon: UserPlus,
    tone: 'blue',
  },
  {
    title: 'ایجاد ترم',
    description: 'تعریف برنامه آموزشی جدید',
    href: '/admin/terms/new',
    icon: GraduationCap,
    tone: 'purple',
  },
  {
    title: 'انتشار مقاله',
    description: 'افزودن محتوای تازه به بلاگ',
    href: '/admin/blogs/new',
    icon: FileEdit,
    tone: 'emerald',
  },
  {
    title: 'مدیریت محصولات',
    description: 'بررسی موجودی و اطلاعات فروشگاه',
    href: '/admin/products',
    icon: Package,
    tone: 'amber',
  },
  {
    title: 'پاسخ به تیکت‌ها',
    description: 'پیگیری درخواست‌های پشتیبانی',
    href: '/admin/tickets',
    icon: MessageSquare,
    tone: 'blue',
  },
  {
    title: 'گزارش‌های آموزشی',
    description: 'مشاهده گزارش جلسات ثبت‌شده',
    href: '/admin/reports',
    icon: BookOpen,
    tone: 'purple',
  },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<{ data: AdminDashboardData }>(
        API_ENDPOINTS.PANEL.ADMIN.DASHBOARD
      );
      setData(response.data);
    } catch (requestError) {
      setError(
        (requestError as ApiError).message || 'دریافت اطلاعات داشبورد انجام نشد'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !data) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const dashboard = data ?? { students: 0, terms: 0, blogs: 0, tickets: 0 };

  return (
    <div className="min-w-0 space-y-6">
      <DashboardHeader
        title="داشبورد مدیریت"
        description="نمای لحظه‌ای از داده‌های ثبت‌شده در سامانه"
        onRefresh={fetchDashboard}
        refreshing={loading}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="دانش‌پژوهان"
          value={dashboard.students.toLocaleString('fa-IR')}
          hint="پرونده ثبت‌شده"
          icon={Users}
          tone="blue"
        />
        <DashboardStatCard
          label="ترم‌ها"
          value={dashboard.terms.toLocaleString('fa-IR')}
          hint="ترم آموزشی ثبت‌شده"
          icon={GraduationCap}
          tone="purple"
        />
        <DashboardStatCard
          label="مقالات بلاگ"
          value={dashboard.blogs.toLocaleString('fa-IR')}
          hint="مقاله موجود در سامانه"
          icon={BookOpen}
          tone="emerald"
        />
        <DashboardStatCard
          label="تیکت‌ها"
          value={dashboard.tickets.toLocaleString('fa-IR')}
          hint="درخواست پشتیبانی ثبت‌شده"
          icon={MessageSquare}
          tone="amber"
        />
      </div>

      <DashboardSection title="دسترسی سریع">
        <DashboardQuickActions actions={quickActions} />
      </DashboardSection>
    </div>
  );
}
