export interface Term {
  id: number | string;
  title: string;
  duration: number; // Duration in minutes
  number_of_sessions: number;
  level_id: number;
  level: {
    id: number;
    name: string;
    label: string;
  };
  start_date: string; // Persian date format like "1404-01-20"
  end_date: string; // Persian date format like "1404-03-20"
  type: 'normal' | 'capacity_completion' | 'project_based' | 'specialized' | 'ai';
  capacity: number;
  price: number;
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
  type: 'normal' | 'capacity_completion' | 'project_based' | 'specialized' | 'ai';
  capacity: string; // API expects string
  price: string; // API expects string
}

export interface UpdateTermRequest {
  title?: string;
  duration?: number;
  number_of_sessions?: number;
  level_id?: number;
  start_date?: string; // Persian date format like "1404-01-20"
  end_date?: string; // Persian date format like "1404-03-20"
  type?: 'normal' | 'capacity_completion' | 'project_based' | 'specialized' | 'ai';
  capacity?: string; // API expects string
  price?: string; // API expects string
}
