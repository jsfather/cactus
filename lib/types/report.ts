// Report related types based on API response structure

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
  session_date: string;
  start_time: string;
  end_time: string;
  homeworks: Homework[];
}

export interface Teacher {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string;
  address: string | null;
  postal_code: string | null;
  national_code: string;
  profile_picture: string | null;
  files: any[];
}

export interface Report {
  id: number;
  content: string;
  teacher: Teacher;
  schedule: Schedule;
  term: any | null;
  created_at: string;
}

export interface CreateReportRequest {
  term_id: number;
  term_teacher_schedule_id: number;
  content: string;
}

export interface UpdateReportRequest {
  content?: string;
}

export interface ReportListResponse {
  data: Report[];
}

export interface ReportResponse {
  data: Report;
}

export interface CreateReportResponse {
  data: {
    id: number;
    content: string;
    created_at: string;
  };
}
