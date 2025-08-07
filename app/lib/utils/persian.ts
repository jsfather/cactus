// Persian number utilities

const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Convert Persian/Arabic numbers to English numbers
 */
export function convertToEnglishNumbers(str: string | number): string {
  if (str === null || str === undefined) return '';

  // Convert to string first
  let result = String(str);

  // Convert Persian numbers
  persianNumbers.forEach((persianNum, index) => {
    result = result.replace(new RegExp(persianNum, 'g'), englishNumbers[index]);
  });

  // Convert Arabic numbers
  arabicNumbers.forEach((arabicNum, index) => {
    result = result.replace(new RegExp(arabicNum, 'g'), englishNumbers[index]);
  });

  return result;
}

/**
 * Convert English numbers to Persian numbers
 */
export function convertToPersianNumbers(str: string): string {
  if (!str) return str;

  let result = str;

  englishNumbers.forEach((englishNum, index) => {
    result = result.replace(new RegExp(englishNum, 'g'), persianNumbers[index]);
  });

  return result;
}

/**
 * Check if string contains only numbers (English, Persian, or Arabic)
 */
export function isNumeric(str: string | number): boolean {
  if (str === null || str === undefined) return false;

  const stringValue = String(str);
  const numericRegex = /^[0-9۰-۹٠-٩]+$/;
  return numericRegex.test(stringValue);
}
