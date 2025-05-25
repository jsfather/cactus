export interface Term {
  id: string;
  title: string;
  duration: string;
  number_of_sessions: string;
  level_id: number;
  start_date: string;
  end_date: string;
  type: 'normal' | 'capacity_completion' | 'vip';
  capacity: string;
}