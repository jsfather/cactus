export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/send_otp',
    VERIFY_OTP: '/verify_otp',
  },
  ONBOARDING: {
    INFORMATION: '/information',
    UPLOAD_DOCUMENTS: '/uploadDocuments',
  },
  USER: {
    ME: '/profile',
    UPDATE: '/profile',
  },
  SETTINGS: {
    GET: '/home/settings',
    UPDATE: '/admin/settings',
  },
  HOME: {
    CERTIFICATES: '/home/certificates',
  },
  PANEL: {
    ADMIN: {
      DASHBOARD: '/admin/dashboard',

      BLOG: {
        GET_ALL: '/admin/blogs',
        GET_BY_ID: (id: string) => `/admin/blogs/${id}`,
        CREATE: '/admin/blogs',
        UPDATE: (id: string) => `/admin/blogs/${id}`,
        DELETE: (id: string) => `/admin/blogs/${id}`,
      },

      USERS: {
        GET_ALL: '/admin/users',
        GET_BY_ID: (id: string) => `/admin/users/${id}`,
        CREATE: '/admin/users',
        UPDATE: (id: string) => `/admin/users/${id}`,
        DELETE: (id: string) => `/admin/users/${id}`,
      },

      PRODUCTS: {
        GET_ALL: '/admin/products',
        GET_BY_ID: (id: string) => `/admin/products/${id}`,
        CREATE: '/admin/products',
        UPDATE: (id: string) => `/admin/products/${id}`,
        DELETE: (id: string) => `/admin/products/${id}`,
      },

      PRODUCT_CATEGORIES: {
        GET_ALL: '/admin/product-categories',
        GET_BY_ID: (id: string) => `/admin/product-categories/${id}`,
        CREATE: '/admin/product-categories',
        UPDATE: (id: string) => `/admin/product-categories/${id}`,
        DELETE: (id: string) => `/admin/product-categories/${id}`,
      },

      ORDERS: {
        GET_ALL: '/admin/orders',
        GET_BY_ID: (id: string) => `/admin/orders/${id}`,
        UPDATE_STATUS: (id: string) => `/admin/orders/update-status/${id}`,
        DELETE: (id: string) => `/admin/orders/${id}`,
      },

      STUDENTS: {
        GET_ALL: '/admin/students',
        GET_BY_ID: (id: string) => `/admin/students/${id}`,
        CREATE: '/admin/students',
        UPDATE: (id: string) => `/admin/students/${id}`,
        DELETE: (id: string) => `/admin/students/${id}`,
      },

      TEACHERS: {
        GET_ALL: '/admin/teachers',
        GET_BY_ID: (id: string) => `/admin/teachers/${id}`,
        CREATE: '/admin/teachers',
        UPDATE: (id: string) => `/admin/teachers/${id}`,
        DELETE: (id: string) => `/admin/teachers/${id}`,
      },

      TERMS: {
        GET_ALL: '/admin/terms',
        GET_BY_ID: (id: string) => `/admin/terms/${id}`,
        CREATE: '/admin/terms',
        UPDATE: (id: string) => `/admin/terms/${id}`,
        DELETE: (id: string) => `/admin/terms/${id}`,
      },

      LEVELS: {
        GET_ALL: '/admin/levels',
      },

      TERM_STUDENTS: {
        GET_ALL: '/admin/term-students',
        GET_BY_ID: (id: string) => `/admin/term-students/${id}`,
        CREATE: '/admin/term-students',
        UPDATE: (id: string) => `/admin/term-students/${id}`,
        DELETE: (id: string) => `/admin/term-students/${id}`,
      },

      TERM_TEACHERS: {
        GET_ALL: '/admin/term-teachers',
        GET_BY_ID: (id: string) => `/admin/term-teachers/${id}`,
        CREATE: '/admin/term-teachers',
        UPDATE: (id: string) => `/admin/term-teachers/${id}`,
        DELETE: (id: string) => `/admin/term-teachers/${id}`,
      },

      EXAMS: {
        GET_ALL: '/admin/exams',
        GET_BY_ID: (id: string) => `/admin/exams/${id}`,
        CREATE: '/admin/exams',
        UPDATE: (id: string) => `/admin/exams/${id}`,
        DELETE: (id: string) => `/admin/exams/${id}`,
        QUESTIONS: {
          GET_ALL: (examId: string) => `/admin/exams/${examId}/questions`,
          CREATE: (examId: string) => `/admin/exams/${examId}/questions`,
          UPDATE: (examId: string, questionId: string) =>
            `/admin/exams/${examId}/questions/${questionId}`,
          DELETE: (examId: string, questionId: string) =>
            `/admin/exams/${examId}/questions/${questionId}`,
        },
      },

      TICKETS: {
        GET_ALL: '/admin/tickets',
        GET_TEACHERS: '/admin/teacher_tickets',
        GET_BY_ID: (id: string) => `/admin/ticket/${id}`,
        CREATE: '/admin/tickets',
        UPDATE: (id: string) => `/admin/tickets/${id}`,
        DELETE: (id: string) => `/admin/tickets/${id}`,
        CLOSE: (id: string) => `/admin/ticket/${id}/close`,
        REPLY: (id: string) => `/admin/ticket/${id}/reply`,
        DEPARTMENTS: {
          GET_ALL: '/admin/tickets/departments',
          CREATE: '/admin/tickets/departments',
          UPDATE: (id: string) => `/admin/tickets/departments/${id}`,
          DELETE: (id: string) => `/admin/tickets/departments/${id}`,
        },
      },

      FAQS: {
        GET_ALL: '/admin/faqs',
        GET_BY_ID: (id: string) => `/admin/faqs/${id}`,
        CREATE: '/admin/faqs',
        UPDATE: (id: string) => `/admin/faqs/${id}`,
        DELETE: (id: string) => `/admin/faqs/${id}`,
      },

      ABOUT_US: {
        GET: '/admin/about-us',
        UPDATE: '/admin/about-us',
      },

      PANEL_GUIDES: {
        GET_ALL: '/admin/panel-guides',
        GET_BY_ID: (id: string) => `/admin/panel-guides/${id}`,
        CREATE: '/admin/panel-guides',
        UPDATE: (id: string) => `/admin/panel-guides/${id}`,
        DELETE: (id: string) => `/admin/panel-guides/${id}`,
      },

      CERTIFICATES: {
        GET_ALL: '/admin/certificates',
        GET_BY_ID: (id: string) => `/admin/certificates/${id}`,
        CREATE: '/admin/certificates',
        UPDATE: (id: string) => `/admin/certificates/${id}`,
        DELETE: (id: string) => `/admin/certificates/${id}`,
      },
    },

    STUDENT: {
      DASHBOARD: '/student/dashboard',
      PROFILE: '/student/profile',
      COURSES: '/student/courses',
      EXAMS: '/student/exams',
      SCHEDULES: '/student/schedules',
      TICKETS: {
        GET_ALL: '/student/tickets',
        GET_BY_ID: (id: string) => `/student/ticket/${id}`,
        CREATE: '/student/ticket',
        DEPARTMENTS: '/student/tickets/departments',
      },
      ORDERS: {
        GET_ALL: '/orders',
        GET_BY_ID: (id: string) => `/orders/${id}`,
        SHOW_WITH_CODE: '/orders/show_with_code',
        BUY: '/order/buy',
      },
      TERMS: {
        GET_ALL: '/student/terms',
        GET_BY_ID: (id: string) => `/student/terms/${id}`,
        GET_AVAILABLE: '/student/terms/available',
        GET_SKY_ROOM_URL: (scheduleId: string) => `/sky_room_url/${scheduleId}`,
      },
      HOMEWORKS: {
        GET_BY_TERM: (termId: string) => `/student/term_homeworks/${termId}`,
        SUBMIT_ANSWER: '/student/homeworks_answer',
        SEND_MESSAGE: '/student/homeworks-conversation-message',
        REPLY_MESSAGE: '/student/homeworks-conversation-reply',
        GET_CONVERSATION: (conversationId: string) =>
          `/student/homeworks-conversation/${conversationId}`,
      },
    },

    TEACHER: {
      DASHBOARD: '/teacher/dashboard',
      PROFILE: '/teacher/profile',
      STUDENTS: {
        GET_ALL: '/teacher/students',
        GET_BY_ID: (id: string) => `/teacher/students/${id}`,
        GET_BY_TERM: (termId: string) => `/teacher/term_students/${termId}`,
      },
      COURSES: '/teacher/courses',
      SCHEDULES: '/teacher/schedules',
      TICKETS: {
        GET_ALL: '/teacher/tickets',
        GET_BY_ID: (id: string) => `/teacher/ticket/${id}`,
        REPLY: (id: string) => `/teacher/ticket/${id}/reply`,
      },
      TERMS: {
        GET_ALL: '/teacher/terms',
        GET_BY_ID: (id: string) => `/teacher/terms/${id}`,
      },
      HOMEWORKS: {
        GET_ALL: '/teacher/homeworks',
        GET_BY_ID: (id: string) => `/teacher/homeworks/${id}`,
        CREATE: '/teacher/homeworks',
        DELETE: (id: string) => `/teacher/homeworks/${id}`,
        CONVERSATION: {
          GET: (conversationId: string) =>
            `/teacher/homeworks-conversation/${conversationId}`,
          REPLY: '/teacher/homeworks-conversation-reply',
        },
      },

      OFFLINE_SESSIONS: {
        GET_ALL: '/teacher/offline_sessions',
        GET_BY_ID: (id: string) => `/teacher/offline_sessions/${id}`,
        CREATE: '/teacher/offline_sessions',
        UPDATE: (id: string) => `/teacher/offline_sessions/${id}`,
        DELETE: (id: string) => `/teacher/offline_sessions/${id}`,
      },

      REPORTS: {
        GET_ALL: '/teacher/reports',
        GET_BY_ID: (id: string) => `/teacher/reports/${id}`,
        CREATE: '/teacher/reports',
        DELETE: (id: string) => `/teacher/reports/${id}`,
      },
    },

    USER: {
      DASHBOARD: '/user/dashboard',
      PROFILE: '/user/profile',
      ORDERS: '/user/orders',
      TICKETS: '/user/tickets',
    },
  },

  // Public endpoints for main website
  PUBLIC: {
    BLOG: {
      GET_ALL: '/home/blogs',
      GET_BY_ID: (id: string) => `/home/blog/${id}`,
    },

    COURSES: {
      GET_ALL: '/courses',
      GET_BY_ID: (id: string) => `/courses/${id}`,
    },

    SHOP: {
      PRODUCTS: '/products',
      HOME_PRODUCTS: '/home/products',
      PRODUCT_BY_ID: (id: string) => `/products/${id}`,
      CATEGORIES: '/product-categories',
    },

    TEACHERS: {
      GET_ALL: '/teachers',
      GET_BY_ID: (id: string) => `/teachers/${id}`,
    },

    ABOUT: '/about',
    CERTIFICATIONS: '/certifications',
    REQUIREMENTS: '/requirements',

    CONTACT: '/contact',
    HOME_SETTINGS: '/home/settings',
  },

  STUDENT: {
    TICKETS: {
      GET_ALL: '/student/tickets',
      GET_BY_ID: (id: string) => `/student/ticket/${id}`,
      CREATE: '/student/ticket',
      DEPARTMENTS: '/student/tickets/departments',
    },
  },
} as const;
