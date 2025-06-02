import { User, Term, Schedule } from '@/app/lib/types';

export interface Attendance {
  id: number;
  status: 'present' | 'absent';
  absence_reason: string | null;
  mark: string;
  created_at: string;
  student: User;
  teacher: User;
  term: Term;
  schedule: Schedule;
}
