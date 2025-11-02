import { User, Term } from '@/app/lib/types';

// Types based on actual API response structure
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

export interface AttendanceSchedule {
  id: number;
  session_date: string; // Format: "2025-05-15"
  start_time: string; // Format: "20:00:00"
  end_time: string; // Format: "21:30:00"
  homeworks: Homework[];
}

export interface Attendance {
  id: number;
  status: 'present' | 'absent';
  absence_reason: string | null;
  mark: string;
  created_at: string; // Format: "2025-04-15 11:53"
  student: User | null;
  teacher: User | null;
  term: Term | null;
  schedule: AttendanceSchedule;
}

// Request interfaces for creating/updating attendance
export interface CreateAttendanceRequest {
  student_id: string;
  term_id: string;
  term_teacher_schedule_id: string;
  status: 'present' | 'absent';
  absence_reason?: string;
  mark: string;
}

export interface UpdateAttendanceRequest
  extends Partial<CreateAttendanceRequest> {}

// Response interfaces
export interface GetAttendanceListResponse {
  data: Attendance[];
}

export interface GetAttendanceResponse {
  data: Attendance;
}

export interface CreateAttendanceResponse {
  data: Attendance;
}

export interface UpdateAttendanceResponse extends CreateAttendanceResponse {}

// Summary stats for attendances
export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  averageMark: number;
}

// Student term response (from /student/terms)
export interface StudentTermDay {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface StudentTermSchedule {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  sky_room_id: string | null;
  homeworks: Homework[];
}

export interface StudentTerm {
  id: number;
  user: User;
  term: Term;
  schedules: StudentTermSchedule[];
  offline_sessions: any[];
  days: StudentTermDay[];
}

export interface GetStudentTermsResponse {
  data: StudentTerm[];
}
