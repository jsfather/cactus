// Types for available terms that students haven't registered for yet

export interface AvailableTermSchedule {
  id: number;
  session_date: string; // Date format: YYYY-MM-DD  
  start_time: string; // Time format: HH:mm:ss
  end_time: string; // Time format: HH:mm:ss
  homeworks: any[]; // Based on API response structure
}

export interface AvailableTermOfflineSession {
  // Add offline session structure if needed
}

export interface AvailableTermDay {
  id: number;
  day_of_week: string; // Persian day names like "شنبه", "دوشنبه", "چهارشنبه"
  start_time: string; // Time format: HH:mm:ss
  end_time: string; // Time format: HH:mm:ss
}

export interface AvailableTermTeacher {
  id: number;
  schedules: AvailableTermSchedule[];
  offline_sessions: AvailableTermOfflineSession[];
  days: AvailableTermDay[];
}

export interface AvailableTermLevel {
  id: number;
  name: string; // e.g., "6-8"
  label: string; // e.g., "A"
}

// Main available term interface
export interface AvailableTerm {
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
  term_requirements: number[]; // Array of term IDs required before this term
  prerequisite_missing: boolean; // Whether student meets prerequisites
  level: AvailableTermLevel;
  is_bought: boolean; // Whether student has already bought this term
  teachers: AvailableTermTeacher[];
}

// API Response interface
export interface GetAvailableTermsResponse {
  data: AvailableTerm[];
}

// Summary stats for available terms
export interface AvailableTermsStats {
  total: number;
  affordable: number; // Terms within student's budget
  qualified: number; // Terms student meets prerequisites for
  recommended: number; // Terms recommended for student's level
}