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

// Question types
export interface ExamQuestion {
  id: number | string;
  text: string;
  exam_id: number | string;
  file_url?: string | null;
  created_at: string;
  updated_at: string;
  options: ExamQuestionOption[];
}

export interface ExamQuestionOption {
  id: number | string;
  text: string;
  is_correct: number;
  question_id: number | string;
}

export interface CreateQuestionRequest {
  text: string;
  options: Array<{
    text: string;
    is_correct: number;
  }>;
  file?: File;
}

export interface UpdateQuestionRequest {
  text?: string;
  options?: Array<{
    id?: number | string;
    text: string;
    is_correct: number;
  }>;
  file?: File;
}

export interface GetQuestionsResponse {
  data: ExamQuestion[];
}

export interface GetQuestionResponse {
  data: ExamQuestion;
}
