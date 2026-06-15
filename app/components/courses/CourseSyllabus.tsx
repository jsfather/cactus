'use client';

import { BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { CourseSyllabusSection } from '@/app/lib/types/course';
import { useLocale } from '@/app/contexts/LocaleContext';

interface CourseSyllabusProps {
  sections: CourseSyllabusSection[];
}

export default function CourseSyllabus({ sections }: CourseSyllabusProps) {
  const { t } = useLocale();
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  if (!sections.length) return null;

  const toggle = (index: number) => {
    const next = new Set(openSections);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setOpenSections(next);
  };

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t.courses.detail.syllabus}
      </h2>
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id ?? index}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary-600 h-5 w-5" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  openSections.has(index) ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.has(index) && (
              <ul className="border-t border-gray-100 px-6 py-4 dark:border-gray-700">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 py-1.5 text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-primary-600 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
