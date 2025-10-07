export interface ExamQuestionOption {
  id: number;
  text: string;
  is_correct: number;
}

export interface ExamQuestion {
  id: number;
  text: string;
  file_path: string | null;
  options: ExamQuestionOption[];
}

export interface ExamAttempt {
  // Add attempt fields as needed based on API
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  date: string | null;
  duration: number | null;
  term_id: number | null;
  created_by: number;
  questions: ExamQuestion[];
  attempts: ExamAttempt[];
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
  title: string;
  description: string;
  date?: string | null;
  duration?: number | null;
  term_id?: number | null;
}

// Question types
export interface ExamQuestion {
  id: number;
  text: string;
  exam_id: number;
  file_url?: string | null;
  created_at: string;
  updated_at: string;
  options: ExamQuestionOption[];
}

export interface ExamQuestionOption {
  id: number;
  text: string;
  is_correct: number;
  question_id: number;
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
    id?: number;
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
