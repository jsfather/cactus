'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getAttendance } from '@/app/lib/api/student/attendances';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<any>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await getAttendance(resolvedParams.id);
        setAttendance(response.data);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات حضور و غیاب');
        router.push('/student/attendances');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [resolvedParams.id, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حضور و غیاب', href: '/student/attendances' },
          {
            label: 'مشاهده حضور و غیاب',
            href: `/student/attendances/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">وضعیت حضور</h3>
            <p className="mt-1 text-sm text-gray-900">
              {attendance.status === 'present' ? 'حاضر' : 'غایب'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">نمره</h3>
            <p className="mt-1 text-sm text-gray-900">{attendance.mark}</p>
          </div>
        </div>

        {attendance.status === 'absent' && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">دلیل غیبت</h3>
            <p className="mt-1 text-sm text-gray-900">
              {attendance.absence_reason || 'ثبت نشده'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">ترم</h3>
            <p className="mt-1 text-sm text-gray-900">{attendance.term?.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">جلسه</h3>
            <p className="mt-1 text-sm text-gray-900">
              {attendance.schedule?.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">تاریخ</h3>
            <p className="mt-1 text-sm text-gray-900">
              {attendance.created_at}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">مدرس</h3>
            <p className="mt-1 text-sm text-gray-900">
              {attendance.teacher?.name}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/student/attendances')}
          >
            بازگشت
          </Button>
        </div>
      </div>
    </main>
  );
} 