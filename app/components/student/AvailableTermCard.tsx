'use client';

import { AvailableTerm } from '@/app/lib/types/available-term';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle,
  Timer,
  DollarSign,
  User,
  CalendarDays,
} from 'lucide-react';

interface AvailableTermCardProps {
  term: AvailableTerm;
  onRegister?: (termTeacherId: number) => void;
  registering?: boolean;
}

export default function AvailableTermCard({
  term,
  onRegister,
  registering = false,
}: AvailableTermCardProps) {
  const getTermTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      normal: 'عادی',
      capacity_completion: 'تکمیل ظرفیت',
      project_based: 'پروژه محور',
      specialized: 'گرایش تخصصی',
      ai: 'هوش مصنوعی',
    };
    return typeLabels[type] || type;
  };

  const getTermTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      capacity_completion:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      project_based:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      specialized:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      ai: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return (
      typeColors[type] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    );
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const getScheduleInfo = () => {
    if (term.teachers.length === 0) return null;

    const teacher = term.teachers[0];
    const uniqueDays = [...new Set(teacher.days.map((day) => day.day_of_week))];

    return {
      days: uniqueDays,
      timeRange:
        teacher.days.length > 0
          ? `${teacher.days[0].start_time.substring(0, 5)} - ${teacher.days[0].end_time.substring(0, 5)}`
          : null,
      totalSessions: teacher.schedules.length,
    };
  };

  const scheduleInfo = getScheduleInfo();

  return (
    <Card className="p-6 transition-shadow hover:shadow-lg">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {term.title}
            </h3>
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTermTypeColor(term.type)}`}
              >
                {getTermTypeLabel(term.type)}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                سطح {term.level.label}
              </span>
            </div>
          </div>
          {term.is_bought && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="mr-1 h-3 w-3" />
                خریداری شده
              </span>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Timer className="h-4 w-4" />
            <span>{term.duration} دقیقه</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span>{term.number_of_sessions} جلسه</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>ظرفیت: {term.capacity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span>{formatPrice(term.price)} تومان</span>
          </div>
        </div>

        {/* Schedule Info */}
        {scheduleInfo && (
          <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              برنامه زمانی
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {scheduleInfo.days.length > 0 && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{scheduleInfo.days.join('، ')}</span>
                </div>
              )}
              {scheduleInfo.timeRange && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{scheduleInfo.timeRange}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>شروع: {term.start_date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>پایان: {term.end_date}</span>
          </div>
        </div>

        {/* Prerequisites Warning */}
        {term.prerequisite_missing && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-300">
              <AlertCircle className="h-4 w-4" />
              <span>شرایط پیش‌نیاز این ترم را ندارید</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto">
          {term.is_bought ? (
            <Button variant="secondary" className="w-full" disabled>
              قبلاً گذرانده شده
            </Button>
          ) : term.prerequisite_missing ? (
            <Button variant="secondary" className="w-full" disabled>
              عدم رعایت پیش‌نیازها
            </Button>
          ) : term.teachers.length === 0 ? (
            <Button variant="secondary" className="w-full" disabled>
              مدرس برای این ترم تعیین نشده است
            </Button>
          ) : (
            <Button
              onClick={() => onRegister?.(term.teachers[0].id)}
              className="w-full"
              loading={registering}
            >
              ثبت‌نام در ترم
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
