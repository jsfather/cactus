import { Teacher } from '@/app/lib/types/teacher';

export type ShowOnWebsiteValue = boolean | 0 | 1 | '0' | '1' | null | undefined;

/** بک‌اند این فیلد را با ۰ و ۱ برمی‌گرداند */
export function isTeacherVisibleOnWebsite(
  value: ShowOnWebsiteValue | Teacher
): boolean {
  const raw =
    typeof value === 'object' && value !== null && 'show_on_website' in value
      ? value.show_on_website
      : value;

  return raw === true || raw === 1 || raw === '1';
}

export function showOnWebsiteToBoolean(value: ShowOnWebsiteValue): boolean {
  return isTeacherVisibleOnWebsite(value);
}

export function booleanToShowOnWebsite(value: boolean): 0 | 1 {
  return value ? 1 : 0;
}

export function filterPublicTeachers(teachers: Teacher[]): Teacher[] {
  return teachers.filter(
    (teacher) => teacher.user !== null && isTeacherVisibleOnWebsite(teacher)
  );
}

export function getTeacherProfileImageUrl(
  profilePicture: string | null | undefined
): string | null {
  if (!profilePicture) return null;
  if (profilePicture.startsWith('http')) return profilePicture;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || '';
  return `${baseUrl}/${profilePicture}`;
}
