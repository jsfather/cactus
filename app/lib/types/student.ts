import { User } from '@/app/lib/types';

export interface Student {
  user_id: number | string;
  level_id: number | string | null;
  father_name: string | null;
  mother_name: string | null;
  father_job: string | null;
  mother_job: string | null;
  has_allergy: number;
  allergy_details: string | null;
  interest_level: number | null;
  focus_level: number | null;
  birth_date: string | null;
  user: User;
}

// Admin student management types with pagination support
export interface GetStudentListResponse {
  data: Student[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface GetStudentResponse {
  data: Student;
}

export interface CreateStudentRequest {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  email?: string;
  national_code?: string;
  level_id: number;
  father_name: string;
  mother_name: string;
  father_job: string;
  mother_job: string;
  has_allergy: number; // 0 or 1
  allergy_details?: string;
  interest_level: number;
  focus_level: number;
  birth_date: string; // Format: 1375-12-10
  profile_picture?: File;
  national_card?: File;
  certificate?: File;
}

export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  email?: string;
  national_code?: string;
  level_id?: number;
  father_name?: string;
  mother_name?: string;
  father_job?: string;
  mother_job?: string;
  has_allergy?: number; // 0 or 1
  allergy_details?: string;
  interest_level?: number;
  focus_level?: number;
  birth_date?: string; // Format: 1375-12-10
  profile_picture?: File;
  national_card?: File;
  certificate?: File;
}
