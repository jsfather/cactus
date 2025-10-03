import React, { useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import { useTermStudent } from '@/app/lib/hooks/use-term-student';
import { GraduationCap, Calendar, Clock, Users } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

interface StudentActiveTermsProps {
  studentId: string;
}

const StudentActiveTerms: React.FC<StudentActiveTermsProps> = ({
  studentId,
}) => {
  const {
    studentActiveTerms,
    loading,
    fetchStudentActiveTerms,
    clearStudentActiveTerms,
  } = useTermStudent();

  useEffect(() => {
    if (studentId && studentId !== 'new') {
      fetchStudentActiveTerms(studentId);
    }

    return () => {
      clearStudentActiveTerms();
    };
  }, [studentId, fetchStudentActiveTerms, clearStudentActiveTerms]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (!studentActiveTerms || studentActiveTerms.length === 0) {
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
      <div className="mb-4 flex items-center gap-3">
        <GraduationCap className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          ترم‌های فعال ({studentActiveTerms.length})
        </h3>
      </div>

      <div className="space-y-4">
        {studentActiveTerms.map((termStudent) => (
          <div
            key={termStudent.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">
                ترم شماره {termStudent.term_id}
              </h4>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
                فعال
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>
                  تاریخ ثبت‌نام:{' '}
                  {new Date(termStudent.created_at).toLocaleDateString('fa-IR')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="h-4 w-4" />
                <span>شناسه دانش‌پژو: {termStudent.student_id}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>
                  آخرین به‌روزرسانی:{' '}
                  {new Date(termStudent.updated_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StudentActiveTerms;
