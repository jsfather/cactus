export interface Message {
  sender: string;
  is_student: number;
  message: string;
  attachment: string | null;
  created_at: string;
}

export interface Ticket {
  id: number;
  subject: string;
  status: string;
  student: string;
  teacher: string;
  department: string;
  messages: Message[];
}

export interface Reply {
  message: string;
}
