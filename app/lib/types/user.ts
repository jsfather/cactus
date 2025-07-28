import { File } from '@/app/lib/types/file';

export type UserRole = 'admin' | 'student' | 'manager';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone: string;
  email?: string | null;
  national_code?: string | null;
  profile_picture?: string | null;
  files?: File[];
}
