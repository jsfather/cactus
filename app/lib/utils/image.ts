/**
 * Utility functions for handling images and image URLs
 */

const BASE_DOMAIN =
  process.env.NEXT_PUBLIC_STATIC_BASE_URL || 'https://kaktos.kanoonbartarha.ir';

/**
 * Converts a relative or absolute image path to a full URL
 * @param imagePath - The image path from backend (could be relative or absolute)
 * @returns Full URL to the image
 */
export function getImageUrl(
  imagePath: string | null | undefined
): string | null {
  if (!imagePath) return null;

  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path, prepend the base domain
  if (imagePath.startsWith('/')) {
    return `${BASE_DOMAIN}${imagePath}`;
  }

  // If it doesn't start with /, add it
  return `${BASE_DOMAIN}/${imagePath}`;
}

/**
 * Checks if an image URL is valid for displaying
 * @param imagePath - The image path to check
 * @returns Whether the image path is valid and should be displayed
 */
export function isValidImageUrl(imagePath: string | null | undefined): boolean {
  if (!imagePath) return false;

  // Check if it's a valid URL format
  if (imagePath.startsWith('http')) return true;

  // Check if it's a valid relative path
  if (
    imagePath.startsWith('/user_files/') ||
    imagePath.startsWith('user_files/')
  ) {
    return true;
  }

  return false;
}
