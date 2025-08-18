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

// Admin ticket management types
export interface GetTicketListResponse {
  data: Ticket[];
}

export interface GetTicketResponse {
  data: Ticket;
}

export interface CreateTicketRequest {
  subject: string;
  department: string;
  message: string;
  attachment?: string | null;
}

export interface UpdateTicketRequest {
  subject?: string;
  status?: string;
  department?: string;
}

export interface TicketDepartment {
  id: number | string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface GetTicketDepartmentListResponse {
  data: TicketDepartment[];
}
