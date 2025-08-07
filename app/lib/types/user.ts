import { File } from '@/app/lib/types/file';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  national_code?: string | null;
  profile_picture?: string | null;
  role: UserRole;
  files?: File[];
}
