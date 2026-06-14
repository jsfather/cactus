'use client';

import { X } from 'lucide-react';
import {
  CourseTopic,
  CourseLevel,
  CourseAgeGroup,
  CoursePriceType,
} from '@/app/lib/types/course';
import { useLocale } from '@/app/contexts/LocaleContext';

export interface CourseFilterValues {
  topic: CourseTopic | '';
  level: CourseLevel | '';
  age_group: CourseAgeGroup | '';
  price_type: CoursePriceType | '';
}

interface CourseFiltersProps {
  filters: CourseFilterValues;
  onChange: (filters: CourseFilterValues) => void;
  onClear: () => void;
  show: boolean;
}

export default function CourseFilters({
  filters,
  onChange,
  onClear,
  show,
}: CourseFiltersProps) {
  const { t } = useLocale();

  if (!show) return null;

  const update = (key: keyof CourseFilterValues, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">
          {t.courses.filters.title}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-primary-600 dark:text-primary-400 flex items-center gap-1 text-sm hover:underline"
          >
            <X className="h-4 w-4" />
            {t.courses.filters.clear}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.courses.filters.topic}
          </label>
          <select
            value={filters.topic}
            onChange={(e) => update('topic', e.target.value)}
            className="focus:ring-primary-500 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">{t.courses.filters.all}</option>
            <option value="robotics">{t.courses.filters.topics.robotics}</option>
            <option value="programming">
              {t.courses.filters.topics.programming}
            </option>
            <option value="ai">{t.courses.filters.topics.ai}</option>
            <option value="electronics">
              {t.courses.filters.topics.electronics}
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.courses.filters.level}
          </label>
          <select
            value={filters.level}
            onChange={(e) => update('level', e.target.value)}
            className="focus:ring-primary-500 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">{t.courses.filters.all}</option>
            <option value="beginner">{t.courses.filters.levels.beginner}</option>
            <option value="intermediate">
              {t.courses.filters.levels.intermediate}
            </option>
            <option value="advanced">
              {t.courses.filters.levels.advanced}
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.courses.filters.age}
          </label>
          <select
            value={filters.age_group}
            onChange={(e) => update('age_group', e.target.value)}
            className="focus:ring-primary-500 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">{t.courses.filters.all}</option>
            <option value="6-10">{t.courses.filters.ages['6-10']}</option>
            <option value="10-14">{t.courses.filters.ages['10-14']}</option>
            <option value="14-18">{t.courses.filters.ages['14-18']}</option>
            <option value="18+">{t.courses.filters.ages['18+']}</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.courses.filters.price}
          </label>
          <select
            value={filters.price_type}
            onChange={(e) => update('price_type', e.target.value)}
            className="focus:ring-primary-500 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">{t.courses.filters.all}</option>
            <option value="free">{t.courses.filters.prices.free}</option>
            <option value="paid">{t.courses.filters.prices.paid}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
