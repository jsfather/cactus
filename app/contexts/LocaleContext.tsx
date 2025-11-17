'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { defaultLocale, localeDirections } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof getDictionary>;
  dir: 'rtl' | 'ltr';
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  // Initialize locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'fa' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    }
    setMounted(true);
  }, []);

  // Update localStorage and document attributes when locale changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('locale', locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = localeDirections[locale];
    }
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = getDictionary(locale);
  const dir = localeDirections[locale];

  const value: LocaleContextType = {
    locale,
    setLocale,
    t,
    dir,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
