// Environment configuration
export const config = {
  // App info
  APP_NAME: import.meta.env.VITE_APP_TITLE || 'Learning Management System',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.VITE_APP_ENV || 'development',
  
  // API Configuration
  API_URL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000',
  API_TIMEOUT: parseInt(import.meta.env.VITE_APP_API_TIMEOUT) || 10000,
  
  // Feature flags
  FEATURES: {
    ANALYTICS: import.meta.env.VITE_APP_ENABLE_ANALYTICS === 'true',
    ERROR_REPORTING: import.meta.env.VITE_APP_ENABLE_ERROR_REPORTING === 'true',
    PERFORMANCE_MONITORING: import.meta.env.VITE_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
    DEBUG_MODE: import.meta.env.VITE_APP_DEBUG === 'true',
  },
  
  // Firebase configuration
  FIREBASE: {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
  },
  
  // Logging configuration
  LOGGING: {
    LEVEL: import.meta.env.VITE_APP_LOG_LEVEL || 'info',
    ENABLE_CONSOLE: import.meta.env.DEV || import.meta.env.VITE_APP_DEBUG === 'true',
  },
  
  // App settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    AVAILABLE_PAGE_SIZES: [5, 10, 20, 50, 100],
  },
  
  // File upload settings
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
  },
  
  // Security settings
  SECURITY: {
    PASSWORD_MIN_LENGTH: 6,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    MAX_LOGIN_ATTEMPTS: 5,
  },
  
  // UI settings
  UI: {
    THEME: 'light',
    LANGUAGE: 'vi',
    ANIMATIONS_ENABLED: true,
    DARK_MODE_ENABLED: false,
  },
};

// Helper functions
export const isProduction = () => config.ENVIRONMENT === 'production';
export const isDevelopment = () => config.ENVIRONMENT === 'development';
export const isFeatureEnabled = (featureName) => config.FEATURES[featureName] || false;

// Validation
if (!config.API_URL) {
  console.warn('API_URL not configured, using default localhost');
}

if (!config.FIREBASE.apiKey && isProduction()) {
  console.error('Firebase configuration missing in production');
}

export default config;
