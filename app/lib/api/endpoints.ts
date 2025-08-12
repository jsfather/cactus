export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/send_otp',
    VERIFY_OTP: '/verify_otp',
  },
  USER: {
    ME: '/profile',
    UPDATE: '/profile',
  },
  SETTINGS: {
    GET: '/home/settings',
    UPDATE: '/home/settings',
  },
  PANEL: {
    ADMIN: {
      BLOG: {
        GET_ALL: '/admin/blogs',
        GET_BY_ID: (id: string) => `/admin/blogs/${id}`,
        CREATE: '/admin/blogs',
        UPDATE: (id: string) => `/admin/blogs/${id}`,
        DELETE: (id: string) => `/admin/blogs/${id}`,
      },
    },
  },
} as const;
