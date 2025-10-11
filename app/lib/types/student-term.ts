// Types for student terms based on API response structure

export interface StudentTermUser {
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

export interface StudentTermLevel {
  id: number;
  name: string;
  label: string;
}

export interface StudentTermInfo {
  id: number;
  title: string;
  duration: number;
  number_of_sessions: number;
  start_date: string; // Persian date format
  end_date: string; // Persian date format
  type:
    | 'normal'
    | 'capacity_completion'
    | 'project_based'
    | 'specialized'
    | 'ai';
  project_type: any | null;
  capacity: number;
  price: number;
  sort: number;
  term_requirements: any | null;
  prerequisite_missing: boolean;
  level: StudentTermLevel;
  is_bought: boolean;
}

export interface StudentTermHomework {
  // Add homework structure if needed
}

export interface StudentTermAttendance {
  // Add attendance structure if needed
}

export interface StudentTermSchedule {
  id: number;
  session_date: string; // Date format: YYYY-MM-DD
  start_time: string; // Time format: HH:mm:ss
  end_time: string; // Time format: HH:mm:ss
  homeworks: StudentTermHomework[];
  myAttendance?: StudentTermAttendance | null; // Only available in detail view
}

export interface StudentTermOfflineSession {
  // Add offline session structure if needed
}

export interface StudentTermDay {
  id: number;
  day_of_week: string; // Persian day names
  start_time: string; // Time format: HH:mm:ss
  end_time: string; // Time format: HH:mm:ss
}

// Main student term interface
export interface StudentTerm {
  id: number;
  user: StudentTermUser; // Teacher information
  term: StudentTermInfo;
  schedules: StudentTermSchedule[];
  offline_sessions: StudentTermOfflineSession[];
  days: StudentTermDay[];
}

// API Response interfaces
export interface GetStudentTermListResponse {
  data: StudentTerm[];
}

export interface GetStudentTermResponse {
  data: StudentTerm;
}

// Summary stats for the terms list page
export interface StudentTermStats {
  total: number;
  active: number;
  completed: number;
  upcoming: number;
}
