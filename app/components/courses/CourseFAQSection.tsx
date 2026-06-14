'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CourseFAQ } from '@/app/lib/types/course';
import { useLocale } from '@/app/contexts/LocaleContext';

interface CourseFAQSectionProps {
  faqs: CourseFAQ[];
}

export default function CourseFAQSection({ faqs }: CourseFAQSectionProps) {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t.courses.detail.faq}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.id ?? index}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-6 py-4 text-right"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="border-t border-gray-100 px-6 py-4 text-gray-600 dark:border-gray-700 dark:text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
