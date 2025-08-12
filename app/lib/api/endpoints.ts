export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/send_otp',
    VERIFY_OTP: '/verify_otp',
  },
  USER:{
    ME: '/profile',
    UPDATE: '/profile',
  },
  SETTINGS: {
    GET: '/home/settings',
    UPDATE: '/home/settings',
  },
} as const;
