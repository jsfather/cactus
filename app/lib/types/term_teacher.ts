import { User } from '@/app/lib/types';

interface Day {
  id: number | string;
  term_teacher_id: number | string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Schedule {
  id: number | string;
  term_teacher_id: number | string;
  sky_room_id: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  is_canceled: number;
  another_person: number;
  another_person_name: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TermTeacher {
  id: number | string;
  term_id: number | string;
  teacher_id: number | string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User;
  days: Day[];
  schedules: Schedule[];
}
