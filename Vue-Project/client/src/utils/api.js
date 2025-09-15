// Centralized API utilities and constants
import { config } from '../config/environment.js'

// Get API base URL from environment
export const API_BASE_URL = config.API_URL

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/accounts',
  REGISTER: '/accounts',
  
  // Resources
  ACCOUNTS: '/accounts',
  COURSES: '/courses',
  SUBJECTS: '/subjects',
  EXAMS: '/exams',
  QUESTIONS: '/questions',
  COMMENTS: '/comments',
  USER_ANSWERS: '/userAnswers',
  
  // Special endpoints
  COURSES_PAGINATED: (page, limit) => `/courses?_page=${page}&_limit=${limit}`,
  SUBJECTS_BY_COURSE: (courseId, page, limit) => `/subjects?idCourse=${courseId}&_page=${page}&_limit=${limit}`,
  EXAMS_BY_SUBJECT: (subjectId, page, limit) => `/exams?idSubject=${subjectId}&_page=${page}&_limit=${limit}`,
  QUESTIONS_BY_EXAM: (examId) => `/questions?idExam=${examId}`,
  COMMENTS_BY_EXAM: (examId) => `/comments?examId=${examId}`,
  USER_ANSWERS_BY_USER: (userId) => `/userAnswers?idUser=${userId}`,
}

// Build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

// Helper functions for common API patterns
export const apiHelpers = {
  getById: (resource, id) => `${API_BASE_URL}/${resource}/${id}`,
  paginate: (resource, page = 1, limit = 10) => `${API_BASE_URL}/${resource}?_page=${page}&_limit=${limit}`,
  filter: (resource, filters = {}) => {
    const params = new URLSearchParams(filters)
    return `${API_BASE_URL}/${resource}?${params.toString()}`
  },
  search: (resource, query, field = 'name') => `${API_BASE_URL}/${resource}?${field}_like=${query}`,
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiHelpers,
}
