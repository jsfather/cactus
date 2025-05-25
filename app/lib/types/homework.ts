export interface HomeworkAnswer {
  id: number;
  description: string;
  file_url: string;
}

export interface Homework {
  id: number;
  description: string;
  file_url: string | null;
  answers: HomeworkAnswer[];
}
