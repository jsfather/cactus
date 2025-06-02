import { User, Term } from '@/app/lib/types';

export interface HomeworkAnswer {
  id: number;
  description: string;
  file_url: string;
}

export interface Homework {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded';
  mark: string | null;
  answer: string | null;
  attachment_url: string | null;
  created_at: string;
  student: User;
  teacher: User;
  term: Term;
}
