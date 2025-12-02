export interface HomeworkAnswer {
  id: number;
  description: string;
  file_url: string;
}

export interface ConversationMessage {
  id: number;
  message: string;
  sender_type: 'student' | 'teacher';
  created_at: string;
}

export interface Conversation {
  id: number;
  messages: ConversationMessage[];
}

export interface Homework {
  id: number;
  description: string;
  file_url: string;
  answers: HomeworkAnswer[];
  conversations: Conversation[];
}

export interface OfflineSession {
  id: number;
  title: string;
  description: string;
  video_url: string;
  term_id: number;
  term_teacher_id: number;
  created_at: string;
  homeworks: Homework[];
}

export interface OfflineSessionCreateRequest {
  title: string;
  description: string;
  video_url: string;
  term_id: string | number;
  term_teacher_id: string | number;
}

export interface OfflineSessionUpdateRequest {
  title: string;
  description: string;
  video_url: string;
  term_id: string | number;
  term_teacher_id: string | number;
}

export interface OfflineSessionResponse {
  data: OfflineSession;
  message?: string;
}

export interface OfflineSessionListResponse {
  data: OfflineSession[];
}
