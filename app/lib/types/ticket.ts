export interface Message {
  sender: string;
  is_student: number;
  message: string;
  attachment: string | null;
  created_at: string;
}

export interface Ticket {
  id: number | string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  student?: string;
  teacher?: string;
  department?: string;
  messages?: Message[];
  created_at: string;
  updated_at: string;
  type?: 'student' | 'teacher'; // Added for filtering
}

export interface Reply {
  message: string;
}

// Admin ticket management types
export interface GetTicketListResponse {
  data: Ticket[];
}

export interface GetTicketResponse {
  data: Ticket;
}

export interface CreateTicketRequest {
  subject: string;
  department?: string;
  message: string;
  attachment?: string | null;
}

export interface UpdateTicketRequest {
  subject?: string;
  status?: 'open' | 'closed' | 'pending';
  department?: string;
}

export interface ReplyTicketRequest {
  message: string;
}

export interface TicketDepartment {
  id: number | string;
  title: string;
  name?: string; // For backward compatibility
  description?: string;
  is_active?: boolean;
}

export interface GetTicketDepartmentListResponse {
  data: TicketDepartment[];
}

export interface CreateTicketDepartmentRequest {
  title: string;
}

export interface UpdateTicketDepartmentRequest {
  title: string;
}
