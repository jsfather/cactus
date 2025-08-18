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

// Admin student management types
export interface GetStudentListResponse {
  data: Student[];
}

export interface GetStudentResponse {
  data: Student;
}

export interface CreateStudentRequest {
  user_id: number;
  level_id?: number | null;
  father_name?: string | null;
  mother_name?: string | null;
  father_job?: string | null;
  mother_job?: string | null;
  has_allergy?: number;
  allergy_details?: string | null;
  interest_level?: number | null;
  focus_level?: number | null;
  birth_date?: string | null;
}

export interface UpdateStudentRequest {
  user_id?: number;
  level_id?: number | null;
  father_name?: string | null;
  mother_name?: string | null;
  father_job?: string | null;
  mother_job?: string | null;
  has_allergy?: number;
  allergy_details?: string | null;
  interest_level?: number | null;
  focus_level?: number | null;
  birth_date?: string | null;
}
