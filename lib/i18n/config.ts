export type Locale = 'fa' | 'en';

export const defaultLocale: Locale = 'fa';
export const locales: Locale[] = ['fa', 'en'];

export const localeNames: Record<Locale, string> = {
  fa: 'فارسی',
  en: 'English',
};

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
  fa: 'rtl',
  en: 'ltr',
};
