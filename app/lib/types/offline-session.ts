// Message interfaces for homework conversations
export interface OfflineSessionHomeworkMessage {
  id: number;
  message: string;
  sender_type: 'student' | 'teacher';
  created_at: string;
}

export interface OfflineSessionHomeworkConversation {
  id: number;
  messages: OfflineSessionHomeworkMessage[];
}

// Homework answer interface
export interface OfflineSessionHomeworkAnswer {
  id: number;
  description: string;
  file_url: string;
}

// Homework interface
export interface OfflineSessionHomework {
  id: number;
  description: string;
  file_url: string;
  answers: OfflineSessionHomeworkAnswer[];
  conversations: OfflineSessionHomeworkConversation[];
}

// Main offline session interface
export interface OfflineSession {
  id: number;
  title: string;
  description: string;
  video_url: string;
  term_id: number;
  term_teacher_id: number;
  created_at: string;
  homeworks: OfflineSessionHomework[];
}

// API Response interfaces
export interface GetOfflineSessionListResponse {
  data: OfflineSession[];
}

export interface GetOfflineSessionResponse {
  data: OfflineSession;
}

export interface CreateOfflineSessionResponse {
  data: OfflineSession;
  message: string;
}

// Request interfaces for create/update
export interface CreateOfflineSessionRequest {
  title: string;
  description: string;
  video_url: string;
  term_id: string; // API expects string
  term_teacher_id: string; // API expects string
}

export interface UpdateOfflineSessionRequest {
  title: string;
  description: string;
  video_url: string;
  term_id: string; // API expects string
  term_teacher_id: string; // API expects string
}

// Legacy interface for backward compatibility
export interface OfflineSessionRequest extends CreateOfflineSessionRequest {}
