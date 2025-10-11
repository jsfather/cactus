export interface Term {
  id: number | string;
  title: string;
  duration: number; // Duration in minutes
  number_of_sessions: number;
  level_id?: number; // Optional since API might return level object instead
  level: {
    id: number;
    name: string;
    label: string;
  };
  start_date: string; // Persian date format like "1404-01-20"
  end_date: string; // Persian date format like "1404-03-20"
  type:
    | 'normal'
    | 'capacity_completion'
    | 'project_based'
    | 'specialized'
    | 'ai';
  capacity: number;
  price: number;
  sort: number; // Increment number for ordering terms
  term_requirements?: number[]; // Array of term IDs that are required before this term
  project_type?: any;
  students?: any[];
  teachers?: any[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Admin term management types
export interface GetTermListResponse {
  data: Term[];
}

export interface GetTermResponse {
  data: Term;
}

export interface CreateTermRequest {
  title: string;
  duration: number;
  number_of_sessions: number;
  level_id: number;
  start_date: string; // Persian date format like "1404-01-20"
  end_date: string; // Persian date format like "1404-03-20"
  type:
    | 'normal'
    | 'capacity_completion'
    | 'project_based'
    | 'specialized'
    | 'ai';
  capacity: string; // API expects string
  price: string; // API expects string, required, default "0"
  sort: string; // API expects string, required increment number
  term_requirements?: number[]; // Optional array of term IDs
}

export interface UpdateTermRequest {
  title?: string;
  duration?: number;
  number_of_sessions?: number;
  level_id?: number;
  start_date?: string; // Persian date format like "1404-01-20"
  end_date?: string; // Persian date format like "1404-03-20"
  type?:
    | 'normal'
    | 'capacity_completion'
    | 'project_based'
    | 'specialized'
    | 'ai';
  capacity?: string; // API expects string
  price?: string; // API expects string
  sort?: string; // API expects string, increment number
  term_requirements?: number[]; // Optional array of term IDs
}
