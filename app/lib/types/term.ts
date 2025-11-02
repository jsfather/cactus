export interface Schedule {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  homeworks: any[];
}

export interface TermDay {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface TermTeacher {
  id: number;
  user?: User;
  schedules: Schedule[];
  offline_sessions: any[];
  days: TermDay[];
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  national_code: string;
  profile_picture: string | null;
  files: any[];
}

export interface TermStudent {
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
  user: User;
}

export interface Term {
  id: number | string;
  title: string;
  duration: number; // Duration in minutes
  number_of_sessions: number;
  level_id?: number; // Optional since API might return level object instead
  level: {
    id: number;
    name: string;
    label: string;
  };
  start_date: string; // Persian date format like "1404-01-20"
  end_date: string; // Persian date format like "1404-03-20"
  type:
    | 'normal'
    | 'capacity_completion'
    | 'project_based'
    | 'specialized'
    | 'ai';
  capacity: number;
  price: number;
  sort: number; // Increment number for ordering terms
  term_requirements?: number[]; // Array of term IDs that are required before this term
  is_in_person: boolean; // Whether the term is offered in-person
  is_online: boolean; // Whether the term is offered online
  is_downloadable: boolean; // Whether the term content is downloadable
  prerequisite_missing?: boolean;
  project_type?: any;
  is_bought?: boolean;
  students?: TermStudent[];
  teachers?: TermTeacher[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Admin term management types
export interface GetTermListResponse {
  data: Term[];
}

export interface GetTermResponse {
  data: Term;
}

export interface CreateTermRequest {
  title: string;
  duration: number;
  number_of_sessions: number;
  level_id: number;
  start_date: string; // Persian date format like "1404-01-20"
  end_date: string; // Persian date format like "1404-03-20"
  type:
    | 'normal'
    | 'capacity_completion'
    | 'project_based'
    | 'specialized'
    | 'ai';
  capacity: string; // API expects string
  price: string; // API expects string, required, default "0"
  sort: string; // API expects string, required increment number
  term_requirements?: number[]; // Optional array of term IDs
  is_in_person: boolean;
  is_online: boolean;
  is_downloadable: boolean;
}

export interface UpdateTermRequest {
  title?: string;
  duration?: number;
  number_of_sessions?: number;
  level_id?: number;
  start_date?: string; // Persian date format like "1404-01-20"
  end_date?: string; // Persian date format like "1404-03-20"
  type?:
    | 'normal'
    | 'capacity_completion'
    | 'project_based'
    | 'specialized'
    | 'ai';
  capacity?: string; // API expects string
  price?: string; // API expects string
  sort?: string; // API expects string, increment number
  term_requirements?: number[]; // Optional array of term IDs
  is_in_person?: boolean;
  is_online?: boolean;
  is_downloadable?: boolean;
}
