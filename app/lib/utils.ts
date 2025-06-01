export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US'
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};


export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

const persianToEnglish: { [key: string]: string } = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};

const arabicToEnglish: { [key: string]: string } = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

export const convertToEnglishNumbers = (input: string): string => {
  return input
    .replace(/[۰-۹]/g, (match) => persianToEnglish[match] || match)
    .replace(/[٠-٩]/g, (match) => arabicToEnglish[match] || match);
};

export const convertToPersianNumbers = (input: string): string => {
  const englishToPersian: { [key: string]: string } = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };

  return input.replace(/[0-9]/g, (match) => englishToPersian[match] || match);
};

export const convertToArabicNumbers = (input: string): string => {
  const englishToArabic: { [key: string]: string } = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
  };

  return input.replace(/[0-9]/g, (match) => englishToArabic[match] || match);
};

export const hasPersianNumbers = (input: string): boolean => {
  return /[۰-۹]/.test(input);
};

export const hasArabicNumbers = (input: string): boolean => {
  return /[٠-٩]/.test(input);
};

export const hasNonEnglishNumbers = (input: string): boolean => {
  return hasPersianNumbers(input) || hasArabicNumbers(input);
};

export const extractEnglishNumbers = (input: string): string[] => {
  const converted = convertToEnglishNumbers(input);
  return converted.match(/\d/g) || [];
};

export { persianToEnglish, arabicToEnglish };
