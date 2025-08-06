export interface Term {
  id: number | string;
  title: string;
  duration: string | number; // Can be string or number from server
  number_of_sessions: string | number; // Can be string or number from server
  level_id: number;
  level: {
    id: number;
    name: string;
    label: string;
  };
  start_date: string;
  end_date: string;
  type: 'normal' | 'capacity_completion' | 'vip';
  capacity: string | number; // Can be string or number from server
  project_type?: any;
  students?: any[];
  teachers?: any[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
