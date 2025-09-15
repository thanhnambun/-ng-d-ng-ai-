// Centralized constants cho toàn bộ ứng dụng

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_LIMITS: [5, 10, 20, 50],
};

// Local storage keys
export const STORAGE_KEYS = {
  LOGIN_KEY: 'keyLogin',
  USER_ROLE: 'userRole',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'true',
  USER: 'false',
};

// Modal types
export const MODAL_TYPES = {
  COURSE: 'course',
  SUBJECT: 'subject',
  EXAM: 'exam',
  QUESTION: 'question',
  ACCOUNT: 'account',
  COMMENT: 'comment',
};

// Form states
export const FORM_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: {
    BASE: '/admin',
    ACCOUNT: '/admin/account',
    COURSE: '/admin/course',
    EXAM: '/admin/exam',
    QUESTION: '/admin/questions',
    SUBJECT: '/admin/subject',
  },
  USER: {
    BASE: '/user',
    HOME: '/user/home',
    COURSE: '/user/course',
    SUBJECT: '/user/subject',
    EXAM: '/user/exam',
    CONTEST: '/user/contest',
    TEST: '/user/test',
    RESULT: '/user/result',
    PROFILE: '/user/profile',
    HISTORY: '/user/history',
  },
};

// Question types and statuses
export const QUESTION = {
  ANSWER_COUNT: 4,
  CORRECT_STATUS: 1,
  INCORRECT_STATUS: 0,
};

// Exam statuses
export const EXAM_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

// Time units (in milliseconds)
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  LOGIN_REQUIRED: 'Vui lòng đăng nhập để tiếp tục.',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  CREATE_SUCCESS: 'Tạo mới thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  SAVE_SUCCESS: 'Lưu thành công!',
};

// Default values for forms
export const DEFAULT_VALUES = {
  COURSE: {
    name: '',
    description: '',
    image: null,
  },
  SUBJECT: {
    name: '',
    idCourse: '',
    image: null,
  },
  EXAM: {
    name: '',
    time: 60,
    idSubject: '',
    description: '',
  },
  QUESTION: {
    text: '',
    idExam: '',
    sequence: 0,
    answerList: [
      { answer: '', status: 0 },
      { answer: '', status: 0 },
      { answer: '', status: 0 },
      { answer: '', status: 0 },
    ],
  },
  ACCOUNT: {
    fullName: '',
    email: '',
    password: '',
    role: USER_ROLES.USER,
    avatar: null,
  },
};

export default {
  API_CONFIG,
  PAGINATION,
  STORAGE_KEYS,
  USER_ROLES,
  MODAL_TYPES,
  FORM_STATES,
  NOTIFICATION_TYPES,
  FILE_UPLOAD,
  ROUTES,
  QUESTION,
  EXAM_STATUS,
  TIME_UNITS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_VALUES,
};
