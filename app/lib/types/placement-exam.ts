export interface PlacementExam {
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

export interface PlacementExamQuestion {
  id: number | string;
  text: string;
  options: PlacementExamOption[];
  file?: string;
  exam_id: number | string;
}

export interface PlacementExamOption {
  id: number | string;
  text: string;
  is_correct: number;
  question_id: number | string;
}

export interface PlacementExamAttempt {
  id: number | string;
  exam_id: number | string;
  student_id: number | string;
  started_at: string;
  finished_at?: string;
  status: 'in_progress' | 'completed' | 'expired';
}

export interface PlacementExamAnswer {
  id: number | string;
  attempt_id: number | string;
  question_id: number | string;
  option_id: number | string;
  answered_at: string;
}

export interface PlacementExamSession {
  attempt: PlacementExamAttempt;
  exam: PlacementExam;
  questions: PlacementExamQuestion[];
  current_question_index: number;
  total_questions: number;
  answers: Record<string, number | string>;
}
