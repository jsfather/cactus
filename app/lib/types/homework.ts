// User types
export interface HomeworkUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  national_code: string;
  profile_picture: string | null;
  files: Array<{
    type: string;
    file_path: string;
  }>;
}

// Level type
export interface Level {
  id: number;
  name: string;
  label: string;
}

// Term type
export interface HomeworkTerm {
  id: number;
  title: string;
  duration: number;
  number_of_sessions: number;
  start_date: string;
  end_date: string;
  type: string;
  project_type: string | null;
  capacity: number;
  price: number;
  sort: number;
  term_requirements: any[];
  is_in_person: boolean;
  is_online: boolean;
  is_downloadable: boolean;
  prerequisite_missing: boolean;
  level: Level;
  is_bought: boolean;
}

// Answer type
export interface HomeworkAnswer {
  id: number;
  description: string;
  file_url: string | null;
  created_at?: string;
}

// Conversation message type
export interface ConversationMessage {
  id: number;
  message: string;
  sender_type: 'student' | 'teacher';
  sender: HomeworkUser;
  created_at: string;
}

// Conversation type
export interface HomeworkConversation {
  id: number;
  sender?: HomeworkUser;
  messages?: ConversationMessage[];
}

// Schedule type
export interface HomeworkSchedule {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  sky_room_id: string | null;
  homeworks?: Array<{
    id: number;
    description: string;
    file_url: string;
    answers: HomeworkAnswer[];
  }>;
}

// Main Homework type
export interface Homework {
  id: number;
  description: string;
  file_url: string;
  answers: HomeworkAnswer[];
  conversations: HomeworkConversation[];
  term: HomeworkTerm;
  teacher: HomeworkUser;
  schedule: HomeworkSchedule;
}

// API Response types
export interface GetHomeworkListResponse {
  data: Homework[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface GetConversationResponse {
  data: HomeworkConversation;
}

// Request types
export interface SendMessageRequest {
  homework_id: number;
  message: string;
}

export interface ReplyMessageRequest {
  conversation_id: number;
  message: string;
}

export interface SubmitAnswerRequest {
  homework_id: number;
  description: string;
  file?: File;
}

// Response types for message operations
export interface MessageResponse {
  status: string;
  message: {
    homework_conversation_id: number;
    sender_id: number;
    sender_type: string;
    message: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
}
