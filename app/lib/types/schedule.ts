import { Homework } from '@/app/lib/types';

export interface Schedule {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  homeworks: Homework[];
}
