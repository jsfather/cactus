import { User, Term } from '@/app/lib/types';

export interface UserFile {
  id: number;
  user_id: number;
  type: 'certificate' | 'national_card' | string;
  file_path: string;
  created_at: string;
  updated_at: string;
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
  term_teacher_id: number;
  sky_room_id: string | null;
  session_date: string; // format: YYYY-MM-DD
  start_time: string;   // format: HH:MM:SS
  end_time: string;     // format: HH:MM:SS
  is_canceled: number;
  another_person: number;
  another_person_name: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  homeworks: Homework[];
}

export interface OfflineSession {
  id: number;
  title: string;
  description: string;
  video_url: string;
  term_id: number;
  term_teacher_id: number;
  created_at: string;
  homeworks: Homework[];
}

export interface Day {
  id: number;
  term_teacher_id?: number;
  day_of_week: string; // Persian day name like "یکشنبه"
  start_time: string; // format: HH:MM:SS
  end_time: string; // format: HH:MM:SS
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// List response interface - used in GET /admin/term-teachers
export interface TermTeacher {
  id: number;
  user: User & {
    files: UserFile[];
  };
  term: Term;
  schedules: Schedule[];
  offline_sessions: OfflineSession[];
  days: Day[];
}

// Detail response interface - used in GET /admin/term-teachers/{id}
export interface TermTeacherDetail {
  id: number;
  term_id: number;
  teacher_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User & {
    files: UserFile[];
  };
  days: Day[];
  schedules: Schedule[];
}

// Legacy interface for backward compatibility
export interface SessionRecord extends TermTeacher {}

// Request interfaces
export interface CreateTermTeacherRequest {
  term_id: number;
  teacher_id: number;
  days: Array<{
    day_of_week: string;
    start_time: string;
    end_time: string;
  }>;
}

export interface UpdateTermTeacherRequest extends CreateTermTeacherRequest {}

// Response interfaces
export interface GetTermTeacherListResponse {
  data: TermTeacher[];
}

export interface GetTermTeacherResponse {
  data: TermTeacherDetail;
}

export interface CreateTermTeacherResponse {
  message: string;
  data: TermTeacherDetail & {
    days: Day[];
    schedules: Schedule[];
  };
}

export interface UpdateTermTeacherResponse extends CreateTermTeacherResponse {}
