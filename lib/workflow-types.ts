export type CourseSections = {
  syllabus: {
    titleFa: string;
    titleEn: string;
    itemsFa: string;
    itemsEn: string;
  }[];
  faqs: {
    questionFa: string;
    questionEn: string;
    answerFa: string;
    answerEn: string;
  }[];
  tools: { nameFa: string; nameEn: string; url: string }[];
  testimonials: { name: string; videoUrl: string }[];
  blogIds: string[];
};
export type ExamSnapshot = {
  id: string;
  type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
  promptFa: string;
  promptEn: string | null;
  points: number;
  correctBoolean: boolean | null;
  correctAnswerFa: string | null;
  correctAnswerEn: string | null;
  options: {
    id: string;
    labelFa: string;
    labelEn: string | null;
    isCorrect: boolean;
  }[];
};
export type AnswerMap = Record<string, string[]>;
