export interface TeacherHomeworkAnswer {
  id: number;
  // Add answer properties when available from API
  [key: string]: any;
}

export interface TeacherHomeworkMessageSender {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  national_code: string | null;
  profile_picture: string | null;
  files: any[];
}

export interface TeacherHomeworkMessage {
  id: number;
  message: string;
  sender_type: 'student' | 'teacher';
  sender: TeacherHomeworkMessageSender | null;
  created_at: string; // Format: "2025-04-01 15:04"
}

export interface TeacherHomeworkConversation {
  id: number;
  sender: TeacherHomeworkMessageSender | null;
  messages: TeacherHomeworkMessage[];
}

export interface TeacherHomeworkLevel {
  id: number;
  name: string;
  label: string;
}

export interface TeacherHomeworkTerm {
  id: number;
  title: string;
  duration: number;
  number_of_sessions: number;
  start_date: string; // Persian date format like "1404-07-20"
  end_date: string; // Persian date format like "1404-08-20"
  type: 'normal' | 'capacity_completion' | 'project_based' | 'specialized' | 'ai';
  project_type: any | null;
  capacity: number;
  price: number;
  sort: number;
  term_requirements: any[];
  prerequisite_missing: boolean;
  level: TeacherHomeworkLevel;
  is_bought: boolean;
}

export interface TeacherHomeworkTeacher {
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
  files: any[];
}

export interface TeacherHomeworkSchedule {
  id: number;
  session_date: string; // Format: "2025-10-12"
  start_time: string; // Format: "11:30:00"
  end_time: string; // Format: "13:30:00"
  homeworks: TeacherHomeworkSummary[];
}

export interface TeacherHomeworkSummary {
  id: number;
  description: string;
  file_url: string | null;
  answers: TeacherHomeworkAnswer[];
}

export interface TeacherHomework {
  id: number;
  description: string;
  file_url: string | null;
  answers: TeacherHomeworkAnswer[];
  conversations?: TeacherHomeworkConversation[];
  term?: TeacherHomeworkTerm;
  teacher?: TeacherHomeworkTeacher;
  schedule?: TeacherHomeworkSchedule;
}

// API Request/Response types
export interface CreateTeacherHomeworkRequest {
  description: string;
  schedule_id: number;
  file?: File; // For file upload
}

export interface UpdateTeacherHomeworkRequest {
  description?: string;
  schedule_id?: number;
  file?: File; // For file upload
}

export interface GetTeacherHomeworkListResponse {
  data: TeacherHomework[];
}

export interface GetTeacherHomeworkResponse {
  data: TeacherHomework;
}

export interface CreateTeacherHomeworkResponse {
  data: TeacherHomework;
}

export interface UpdateTeacherHomeworkResponse {
  data: TeacherHomework;
}

// Conversation API types
export interface GetHomeworkConversationResponse {
  data: TeacherHomeworkConversation;
}

export interface SendHomeworkConversationMessageRequest {
  conversation_id: string;
  message: string;
}

export interface SendHomeworkConversationMessageResponse {
  status: string;
  message: {
    id: number;
    homework_conversation_id: string;
    sender_id: number;
    sender_type: 'teacher' | 'student';
    message: string;
    created_at: string;
    updated_at: string;
  };
}

// Helper functions and constants
export const TEACHER_HOMEWORK_TERM_TYPE_LABELS = {
  normal: 'عادی',
  capacity_completion: 'تکمیل ظرفیت',
  project_based: 'پروژه محور (ویژه)',
  specialized: 'گرایش تخصصی',
  ai: 'هوش مصنوعی',
} as const;

export const getTeacherHomeworkTermTypeLabel = (type: TeacherHomeworkTerm['type']): string => {
  return TEACHER_HOMEWORK_TERM_TYPE_LABELS[type];
};

// Helper function to format homework display
export const formatHomeworkDescription = (description: string, maxLength: number = 100): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength) + '...';
};