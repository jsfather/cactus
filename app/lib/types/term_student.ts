import { User } from '@/app/lib/types';

export interface TermStudent {
  id: number | string;
  term_id: number | string;
  student_id: number | string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User;
}
