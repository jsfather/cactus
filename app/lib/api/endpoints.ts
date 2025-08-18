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
        CREATE: '/admin/orders',
        UPDATE: (id: string) => `/admin/orders/${id}`,
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
      },
      
      TICKETS: {
        GET_ALL: '/admin/tickets',
        GET_BY_ID: (id: string) => `/admin/tickets/${id}`,
        CREATE: '/admin/tickets',
        UPDATE: (id: string) => `/admin/tickets/${id}`,
        DELETE: (id: string) => `/admin/tickets/${id}`,
        DEPARTMENTS: '/admin/tickets/departments',
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
    },
    
    STUDENT: {
      DASHBOARD: '/student/dashboard',
      PROFILE: '/student/profile',
      COURSES: '/student/courses',
      EXAMS: '/student/exams',
      SCHEDULES: '/student/schedules',
      TICKETS: '/student/tickets',
    },
    
    TEACHER: {
      DASHBOARD: '/teacher/dashboard',
      PROFILE: '/teacher/profile',
      STUDENTS: '/teacher/students',
      COURSES: '/teacher/courses',
      SCHEDULES: '/teacher/schedules',
      TICKETS: '/teacher/tickets',
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
      GET_ALL: '/blogs',
      GET_BY_ID: (id: string) => `/blogs/${id}`,
    },
    
    COURSES: {
      GET_ALL: '/courses',
      GET_BY_ID: (id: string) => `/courses/${id}`,
    },
    
    SHOP: {
      PRODUCTS: '/products',
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
} as const;
