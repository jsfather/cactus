import { User } from '@/app/lib/types';

export interface Teacher {
  user_id: number | string;
  bio: string;
  user: User;
  level_id?: number | string;
  father_name?: string;
  mother_name?: string;
  father_job?: string;
  mother_job?: string;
  has_allergy?: number | string;
  allergy_details?: string;
  interest_level?: number | string;
  focus_level?: number | string;
  birth_date?: string;
  national_card?: string;
  certificate?: string;
}
