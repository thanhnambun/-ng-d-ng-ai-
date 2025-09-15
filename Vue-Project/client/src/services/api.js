import axios from 'axios';

import { config } from '../config/environment.js';

// Cấu hình base API
const API_BASE_URL = config.API_URL;

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để add token nếu cần
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('keyLogin');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('keyLogin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET với pagination support
  async get(endpoint, params = {}) {
    try {
      const response = await apiClient.get(endpoint, { params });
      return {
        data: response.data,
        totalCount: response.headers['x-total-count'],
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }
  },

  // POST
  async post(endpoint, data) {
    try {
      const response = await apiClient.post(endpoint, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }
  },

  // PUT
  async put(endpoint, data) {
    try {
      const response = await apiClient.put(endpoint, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }
  },

  // DELETE
  async delete(endpoint) {
    try {
      await apiClient.delete(endpoint);
      return {
        success: true,
      };
    } catch (error) {
      return {
        error: error.message,
        success: false,
      };
    }
  },

  // GET với pagination
  async getPaginated(endpoint, page = 1, limit = 10, additionalParams = {}) {
    const params = {
      _page: page,
      _limit: limit,
      ...additionalParams,
    };
    
    try {
      const response = await apiClient.get(endpoint, { params });
      const totalPages = Math.ceil(parseInt(response.headers['x-total-count']) / limit);
      
      return {
        data: response.data,
        totalPages,
        totalCount: response.headers['x-total-count'],
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        totalPages: 0,
        error: error.message,
        success: false,
      };
    }
  },
};

export default api;
