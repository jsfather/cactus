export interface TeacherTermFile {
  type: string;
  file_path: string;
}

export interface TeacherTermUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  national_code: string | null;
  profile_picture: string | null;
  files: TeacherTermFile[];
}

export interface TeacherTermHomework {
  // Define homework structure when needed
  [key: string]: any;
}

export interface TeacherTermSchedule {
  id: number;
  session_date: string; // Format: "2025-10-12"
  start_time: string; // Format: "11:30:00"
  end_time: string; // Format: "13:30:00"
  homeworks: TeacherTermHomework[];
}

export interface TeacherTermOfflineSession {
  // Define offline session structure when needed
  [key: string]: any;
}

export interface TeacherTermDay {
  id: number;
  day_of_week: string; // Persian day names like "یکشنبه"
  start_time: string; // Format: "11:30:00"
  end_time: string; // Format: "13:30:00"
}

export interface TeacherTermTeacher {
  id: number;
  schedules: TeacherTermSchedule[];
  offline_sessions: TeacherTermOfflineSession[];
  days: TeacherTermDay[];
}

export interface TeacherTermStudent {
  user_id: number | null;
  level_id: number | null;
  father_name: string | null;
  mother_name: string | null;
  father_job: string | null;
  mother_job: string | null;
  has_allergy: boolean | null;
  allergy_details: string | null;
  interest_level: string | null;
  focus_level: string | null;
  birth_date: string | null;
  user: TeacherTermUser | null;
}

export interface TeacherTermLevel {
  id: number;
  name: string;
  label: string;
}

export interface TeacherTermRequirement {
  // Define requirement structure when needed
  [key: string]: any;
}

export interface TeacherTerm {
  id: number;
  title: string;
  duration: number; // Duration in minutes
  number_of_sessions: number;
  start_date: string; // Persian date format like "1404-07-20"
  end_date: string; // Persian date format like "1404-08-20"
  type: 'normal' | 'capacity_completion' | 'project_based' | 'specialized' | 'ai';
  project_type: any | null;
  capacity: number;
  price: number;
  sort: number;
  term_requirements: TeacherTermRequirement[];
  prerequisite_missing: boolean;
  level: TeacherTermLevel;
  is_bought: boolean;
  teachers: TeacherTermTeacher[];
  students: TeacherTermStudent[];
}

// API Response types
export interface GetTeacherTermListResponse {
  data: TeacherTerm[];
}

export interface GetTeacherTermResponse {
  data: TeacherTerm;
}

// Helper type for term type display
export const TEACHER_TERM_TYPE_LABELS = {
  normal: 'عادی',
  capacity_completion: 'تکمیل ظرفیت',
  project_based: 'پروژه محور (ویژه)',
  specialized: 'گرایش تخصصی',
  ai: 'هوش مصنوعی',
} as const;

// Helper function to get Persian term type label
export const getTeacherTermTypeLabel = (type: TeacherTerm['type']): string => {
  return TEACHER_TERM_TYPE_LABELS[type];
};