export interface NotificationData {
  title?: string;
  message?: string;
  body?: string;
  url?: string;
  type?: string;
  [key: string]: unknown;
}

export interface UserNotification {
  id: string | number;
  type?: string;
  title?: string;
  message?: string;
  data?: NotificationData;
  read_at?: string | null;
  created_at?: string;
}

export interface GetNotificationsResponse {
  data: UserNotification[] | { data: UserNotification[] };
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UpdatePasswordResponse {
  message?: string;
}

export interface SendSampleNotificationRequest {
  userId: number;
  type: string;
  url?: string;
}
