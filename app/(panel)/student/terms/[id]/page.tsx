'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getTerm } from '@/app/lib/api/student/terms';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState<any>(null);

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        const response = await getTerm(resolvedParams.id);
        setTerm(response);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات ترم');
        router.push('/student/terms');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [resolvedParams.id, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم‌ها', href: '/student/terms' },
          {
            label: 'مشاهده ترم',
            href: `/student/terms/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">عنوان</h3>
            <p className="mt-1 text-sm text-gray-900">{term.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">نوع ترم</h3>
            <p className="mt-1 text-sm text-gray-900">{term.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">مدت زمان</h3>
            <p className="mt-1 text-sm text-gray-900">{term.duration}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">تعداد جلسات</h3>
            <p className="mt-1 text-sm text-gray-900">{term.number_of_sessions}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">تاریخ شروع</h3>
            <p className="mt-1 text-sm text-gray-900">{term.start_date}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">تاریخ پایان</h3>
            <p className="mt-1 text-sm text-gray-900">{term.end_date}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">مدرس</h3>
            <p className="mt-1 text-sm text-gray-900">{term.teacher?.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">وضعیت</h3>
            <p className="mt-1 text-sm text-gray-900">{term.status}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/student/terms')}
          >
            بازگشت
          </Button>
        </div>
      </div>
    </main>
  );
}
