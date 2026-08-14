'use client';

import { useLocale } from '@/app/contexts/LocaleContext';
import { locales, localeNames, type Locale } from '@/lib/i18n/config';
import { Languages } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="icon-button gap-2 px-2"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Languages className="h-5 w-5" />
        <span className="hidden text-sm font-medium md:inline">
          {localeNames[locale]}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full left-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-800"
        >
          {locales.map((loc) => (
            <button
              type="button"
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`block min-h-10 w-full rounded-xl px-3 py-2 text-right text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                locale === loc
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {localeNames[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
