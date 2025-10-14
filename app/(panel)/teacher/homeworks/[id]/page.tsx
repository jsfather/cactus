'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import ConversationComponent from '@/app/components/ui/ConversationComponent';
import { useTeacherHomework } from '@/app/lib/hooks/use-teacher-homework';
import { getTeacherHomeworkTermTypeLabel } from '@/app/lib/types/teacher-homework';
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  BookOpen,
  FileText,
  Download,
  User,
  Phone,
  IdCard,
  Trash2,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  School,
  CalendarDays,
  Timer,
} from 'lucide-react';

export default function TeacherHomeworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeworkId = params.id as string;

  const { currentHomework, loading, fetchHomeworkById, clearCurrentHomework, conversations, conversationLoading, sendingMessage, fetchConversation, sendConversationMessage } = useTeacherHomework();

  useEffect(() => {
    if (homeworkId) {
      fetchHomeworkById(homeworkId);
    }

    return () => {
      clearCurrentHomework();
    };
  }, [homeworkId, fetchHomeworkById, clearCurrentHomework]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentHomework) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              تکلیف یافت نشد
            </h1>
            <Button
              onClick={() => router.push('/teacher/homeworks')}
              className="mt-4"
            >
              بازگشت به لیست تکالیف
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const answersCount = currentHomework.answers?.length || 0;
  const conversationsCount = currentHomework.conversations?.length || 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          breadcrumbs={[
            { label: 'داشبورد مدرس', href: '/teacher' },
            { label: 'تکالیف', href: '/teacher/homeworks' },
            { label: 'جزئیات تکلیف', href: `/teacher/homeworks/${currentHomework.id}` },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              جزئیات تکلیف
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              مشاهده کامل اطلاعات تکلیف و پاسخ‌های دانش‌آموزان
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/teacher/homeworks')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت
            </Button>
          </div>
        </div>

        {/* Homework Overview Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    پاسخ‌های دریافتی
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {answersCount.toLocaleString('fa-IR')} پاسخ
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    گفتگوها
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {conversationsCount.toLocaleString('fa-IR')} گفتگو
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    فایل ضمیمه
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentHomework.file_url ? 'دارد' : 'ندارد'}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    تاریخ جلسه
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentHomework.schedule?.session_date || 'نامشخص'}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Homework Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              اطلاعات تکلیف
            </h2>
            
            <div className="space-y-4">
              <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  شرح تکلیف:
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {currentHomework.description}
                </dd>
              </div>

              {currentHomework.file_url && (
                <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    فایل ضمیمه:
                  </dt>
                  <dd>
                    <Button
                      onClick={() => window.open(currentHomework.file_url!, '_blank')}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      دانلود فایل
                    </Button>
                  </dd>
                </div>
              )}

              {currentHomework.schedule && (
                <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    اطلاعات جلسه:
                  </dt>
                  <dd className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                      <span>تاریخ: {currentHomework.schedule.session_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <Timer className="h-4 w-4 text-green-600" />
                      <span>
                        زمان: {currentHomework.schedule.start_time.substring(0, 5)} - {currentHomework.schedule.end_time.substring(0, 5)}
                      </span>
                    </div>
                  </dd>
                </div>
              )}

              {currentHomework.teacher && (
                <div className="py-3">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    مدرس:
                  </dt>
                  <dd className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {currentHomework.teacher.profile_picture ? (
                        <img
                          src={currentHomework.teacher.profile_picture}
                          alt={`${currentHomework.teacher.first_name} ${currentHomework.teacher.last_name}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentHomework.teacher.first_name} {currentHomework.teacher.last_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentHomework.teacher.phone}
                      </p>
                    </div>
                  </dd>
                </div>
              )}
            </div>
          </Card>

          {/* Term Information */}
          {currentHomework.term && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                اطلاعات ترم
              </h2>
              
              <div className="space-y-4">
                <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    عنوان ترم:
                  </dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentHomework.term.title}
                  </dd>
                </div>

                <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    نوع ترم:
                  </dt>
                  <dd>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      currentHomework.term.type === 'normal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      currentHomework.term.type === 'capacity_completion' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      currentHomework.term.type === 'project_based' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                      currentHomework.term.type === 'specialized' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      currentHomework.term.type === 'ai' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {getTeacherHomeworkTermTypeLabel(currentHomework.term.type)}
                    </span>
                  </dd>
                </div>

                <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    سطح:
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {currentHomework.term.level.label} - {currentHomework.term.level.name}
                  </dd>
                </div>

                <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    مدت زمان:
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {currentHomework.term.duration} دقیقه
                  </dd>
                </div>

                <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    تعداد جلسات:
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {currentHomework.term.number_of_sessions} جلسه
                  </dd>
                </div>

                <div className="py-3">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    دوره ترم:
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {currentHomework.term.start_date} تا {currentHomework.term.end_date}
                  </dd>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Answers Section */}
        {answersCount > 0 ? (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              پاسخ‌های دانش‌آموزان ({answersCount} پاسخ)
            </h2>
            
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                پاسخ‌ها در این بخش نمایش داده خواهد شد.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                (جزئیات پاسخ‌ها بر اساس API پیاده‌سازی خواهد شد)
              </p>
            </div>
          </Card>
        ) : (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              پاسخ‌های دانش‌آموزان
            </h2>
            
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                هنوز پاسخی دریافت نشده
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                دانش‌آموزان هنوز به این تکلیف پاسخ نداده‌اند.
              </p>
            </div>
          </Card>
        )}

        {/* Conversations Section */}
        {currentHomework.conversations && currentHomework.conversations.length > 0 ? (
          <div className="mt-8 space-y-6">
            {currentHomework.conversations.map((conversation) => (
              <ConversationComponent
                key={conversation.id}
                conversationId={conversation.id.toString()}
                conversation={conversations[conversation.id.toString()] || null}
                loading={conversationLoading}
                sendingMessage={sendingMessage}
                onFetchConversation={fetchConversation}
                onSendMessage={sendConversationMessage}
              />
            ))}
          </div>
        ) : (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              گفتگوها
            </h2>
            
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                هیچ گفتگویی وجود ندارد
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                هنوز گفتگویی در مورد این تکلیف صورت نگرفته است.
              </p>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}