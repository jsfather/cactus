export interface Exam {
  id: number | string;
  title: string;
  description: string;
  date: string | null;
  duration: number | null;
  term_id: number | null;
  created_at: string;
  updated_at: string;
  created_by: number;
}

// Admin exam management types
export interface GetExamListResponse {
  data: Exam[];
}

export interface GetExamResponse {
  data: Exam;
}

export interface CreateExamRequest {
  title: string;
  description: string;
  date?: string | null;
  duration?: number | null;
  term_id?: number | null;
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  date?: string | null;
  duration?: number | null;
  term_id?: number | null;
}
