import { User } from '@/app/lib/types';

export interface Teacher {
  user_id: number | string;
  bio: string;
  user: User;
}
