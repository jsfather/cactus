export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string;
  address: string | null;
  postal_code: string | null;
  national_code: string;
  profile_picture: string | null;
  files: Array<{
    type: string;
    file_path: string;
  }>;
}

export interface Skill {
  name: string;
  score: number;
}

export interface WorkExperience {
  company: string;
  role: string;
  years: string;
  description?: string;
}

export interface Education {
  degree: string;
  university: string;
  description?: string;
  year: number;
}

export interface Teacher {
  user_id: number;
  bio: string | null;
  about_me: string | null;
  member_since: string | null;
  city: string | null;
  skills: Skill[] | null;
  work_experiences: WorkExperience[] | null;
  educations: Education[] | null;
  achievements: string | null;
  user: User;
}

export interface GetTeacherListResponse {
  data: Teacher[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface GetTeacherResponse {
  data: Teacher;
}

export interface CreateTeacherRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  national_code: string;
  phone: string;
  password: string;
  bio?: string;
  about_me?: string;
  member_since?: string;
  city?: string;
  skills?: Skill[];
  work_experiences?: WorkExperience[];
  educations?: Education[];
  achievements?: string;
}

export interface UpdateTeacherRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  national_code: string;
  phone: string;
  password?: string;
  bio?: string;
  about_me?: string;
  member_since?: string;
  city?: string;
  skills?: Skill[];
  work_experiences?: WorkExperience[];
  educations?: Education[];
  achievements?: string;
}

// Legacy interface for backward compatibility
export interface TeacherRequest extends CreateTeacherRequest {}
