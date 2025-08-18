import { File } from '@/app/lib/types/file';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  national_code: string | null;
  profile_picture: string | null;
  role: UserRole | null;
  files: File[] | [];
}

export interface SendOTPResponse {
  message: string;
}

export interface SendOTPRequest {
  phone: string;
}

export interface VerifyOTPResponse {
  message: string;
  token: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface GetProfileResponse {
  data: User;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string | null;
  national_code: string | null;
  profile_picture: string | null;
}

// Admin user management types
export interface GetUserListResponse {
  data: User[];
}

export interface GetUserResponse {
  data: User;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  national_code?: string | null;
  role: UserRole;
}

export interface UpdateUserRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  national_code?: string | null;
  role: UserRole;
}
