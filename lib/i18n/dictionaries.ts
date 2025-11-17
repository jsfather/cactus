import type { Locale } from './config';
import en from './locales/en';
import fa from './locales/fa';

const dictionaries = {
  en,
  fa,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
