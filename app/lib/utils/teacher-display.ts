import { Teacher } from '@/app/lib/types/teacher';

export function isTeacherVisibleOnWebsite(teacher: Teacher): boolean {
  return teacher.show_on_website !== false;
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
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || '';
  return `${baseUrl}/${profilePicture}`;
}
