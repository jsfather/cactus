import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/app/components/ui/Card';
import { useTerm } from '@/app/lib/hooks/use-term';
import {
  GraduationCap,
  Calendar,
  Clock,
  Eye,
  Power,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Term } from '@/app/lib/types/term';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { studentService } from '@/app/lib/services/student.service';
import toast from 'react-hot-toast';

interface StudentActiveTermsProps {
  studentId: string;
}

const StudentActiveTerms: React.FC<StudentActiveTermsProps> = ({
  studentId,
}) => {
  const router = useRouter();
  const { termList, loading, fetchTermList } = useTerm();
  const [togglingTermId, setTogglingTermId] = useState<string | null>(null);

  useEffect(() => {
    if (studentId && studentId !== 'new') {
      fetchTermList();
    }
  }, [studentId, fetchTermList]);

  const termsWithDetails = useMemo(() => {
    if (!termList?.length) return [];

    return termList.filter((term) =>
      term.students?.some(
        (student) =>
          student.user?.id?.toString() === studentId ||
          student.user_id?.toString() === studentId
      )
    );
  }, [termList, studentId]);

  const handleToggleTerm = async (termId: string) => {
    try {
      setTogglingTermId(termId);
      await studentService.toggleTerm(studentId, termId);
      toast.success('وضعیت ترم دانش‌پژوه تغییر کرد');
      await fetchTermList();
    } catch {
      toast.error('تغییر وضعیت ترم انجام نشد');
    } finally {
      setTogglingTermId(null);
    }
  };

  const getTermTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      normal: 'عادی',
      capacity_completion: 'تکمیل ظرفیت',
      project_based: 'پروژه محور(ویژه)',
      specialized: 'گرایش تخصصی',
      ai: 'هوش مصنوعی',
    };
    return typeLabels[type] || type;
  };

  const getTermStatus = (
    term: Term
  ): { label: string; color: string } => {
    const now = new Date();
    const startDate = new Date(term.start_date);
    const endDate = new Date(term.end_date);

    if (startDate > now) {
      return {
        label: 'آینده',
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      };
    } else if (endDate < now) {
      return {
        label: 'تمام شده',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      };
    } else {
      return {
        label: 'در حال برگزاری',
        color:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      };
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (!termsWithDetails || termsWithDetails.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ترم‌های فعال
          </h3>
        </div>
        <div className="py-8 text-center">
          <GraduationCap className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            این دانش‌پژو در هیچ ترمی ثبت‌نام نکرده است
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ترم‌های فعال ({termsWithDetails.length})
          </h3>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push('/admin/term-students')}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          مشاهده همه
        </Button>
      </div>

      <div className="space-y-4">
        {termsWithDetails.map((term) => {
          const status = getTermStatus(term);
          return (
            <div
              key={term.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {term.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {getTermTypeLabel(term.type)}
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                      {term.level.name} - {term.level.label}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
                >
                  {status.label}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>شروع: {term.start_date}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>پایان: {term.end_date}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>
                    {term.number_of_sessions} جلسه، {term.duration} دقیقه
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <Button
                  variant="warning"
                  loading={togglingTermId === term.id.toString()}
                  onClick={() => handleToggleTerm(term.id.toString())}
                  className="flex items-center gap-2"
                >
                  <Power className="h-4 w-4" />
                  فعال / غیرفعال
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/admin/terms/${term.id}`)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  مشاهده ترم
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StudentActiveTerms;
