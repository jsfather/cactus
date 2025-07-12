export interface Exam {
  id: number | string;
  title: string;
  description: string;
  date: string | null;
  duration: number | null;
  term_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ExamQuestionOption {
  id: number | string;
  text: string;
  is_correct: boolean;
}

export interface ExamQuestion {
  id: number | string;
  exam_id: number | string;
  text: string;
  file: string | null;
  created_at: string;
  updated_at: string;
  options: ExamQuestionOption[];
}
