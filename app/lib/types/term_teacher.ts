import { User } from '@/app/lib/types';

export interface UserFile {
  type: 'certificate' | 'national_card' | string;
  file_path: string;
}

export interface HomeworkAnswer {
  id: number;
  description: string;
  file_url: string;
}

export interface Homework {
  id: number;
  description: string;
  file_url: string | null;
  answers: HomeworkAnswer[];
}

export interface Schedule {
  id: number;
  session_date: string; // format: YYYY-MM-DD
  start_time: string;   // format: HH:MM:SS
  end_time: string;     // format: HH:MM:SS
  homeworks: Homework[];
}

export interface OfflineSession {
  id: number;
  title: string;
  description: string;
  video_url: string;
  term_id: number;
  term_teacher_id: number;
  created_at: string; // timestamp
  homeworks: Homework[];
}

export interface Day {
  id: number;
  day_of_week: string; // Persian day name
  start_time: string;
  end_time: string;
}

export interface SessionRecord {
  id: number;
  user: User;
  term: any; // null in your sample
  schedules: Schedule[];
  offline_sessions: OfflineSession[];
  days: Day[];
}

export interface TermTeacher extends SessionRecord {
  id: number;
  user: User;
  term: any;
  schedules: Schedule[];
  offline_sessions: OfflineSession[];
  days: Day[];
}
