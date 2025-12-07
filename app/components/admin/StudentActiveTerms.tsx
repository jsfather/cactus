import React, { useEffect, useState } from 'react';
import { Card } from '@/app/components/ui/Card';
import { useTermStudent } from '@/app/lib/hooks/use-term-student';
import { useTerm } from '@/app/lib/hooks/use-term';
import {
  GraduationCap,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Eye,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Term } from '@/app/lib/types/term';
import { TermStudent } from '@/app/lib/types/term_student';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

interface StudentActiveTermsProps {
  studentId: string;
}

interface TermWithDetails extends Term {
  registration_date?: string;
}

const StudentActiveTerms: React.FC<StudentActiveTermsProps> = ({
  studentId,
}) => {
  const router = useRouter();
  const {
    studentActiveTerms,
    loading: termStudentLoading,
    fetchStudentActiveTerms,
    clearStudentActiveTerms,
  } = useTermStudent();

  const { termList, loading: termLoading, fetchTermList } = useTerm();
  const [termsWithDetails, setTermsWithDetails] = useState<TermWithDetails[]>(
    []
  );

  useEffect(() => {
    if (studentId && studentId !== 'new') {
      fetchStudentActiveTerms(studentId);
      fetchTermList();
    }

    return () => {
      clearStudentActiveTerms();
    };
  }, [
    studentId,
    fetchStudentActiveTerms,
    clearStudentActiveTerms,
    fetchTermList,
  ]);

  useEffect(() => {
    if (studentActiveTerms && termList) {
      const enrichedTerms: TermWithDetails[] = studentActiveTerms
        .map((termStudent) => {
          const termDetails = termList.find(
            (term) => term.id.toString() === termStudent.term_id.toString()
          );
          if (termDetails) {
            return {
              ...termDetails,
              registration_date: termStudent.created_at,
            };
          }
          return null;
        })
        .filter(Boolean) as TermWithDetails[];

      setTermsWithDetails(enrichedTerms);
    }
  }, [studentActiveTerms, termList]);

  const loading = termStudentLoading || termLoading;

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
    term: TermWithDetails
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

              {term.registration_date && (
                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    <span>
                      تاریخ ثبت‌نام:{' '}
                      {new Date(term.registration_date).toLocaleDateString(
                        'fa-IR'
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-3 flex justify-end">
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
