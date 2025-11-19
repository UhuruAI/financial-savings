// App Constants

export const APP_CONFIG = {
  name: 'Financial Savings',
  version: '1.0.0',
  apiTimeout: 30000, // 30 seconds
  maxRetries: 3,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  THEME: '@theme',
  LANGUAGE: '@language',
  BIOMETRIC_ENABLED: '@biometric_enabled',
  NOTIFICATIONS_ENABLED: '@notifications_enabled',
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // User
  GET_USER: '/users/me',
  UPDATE_USER: '/users/me',
  DELETE_USER: '/users/me',
  CHANGE_PASSWORD: '/users/me/password',

  // Goals
  GOALS: '/goals',
  GOAL_BY_ID: (id: string) => `/goals/${id}`,
  ADD_TO_GOAL: (id: string) => `/goals/${id}/add`,

  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,

  // Cards
  CARDS: '/cards',
  CARD_BY_ID: (id: string) => `/cards/${id}`,

  // Investments
  INVESTMENTS: '/investments',
  INVESTMENT_BY_ID: (id: string) => `/investments/${id}`,
  PORTFOLIO: '/investments/portfolio',

  // Analytics
  ANALYTICS: '/analytics',
  SPENDING_SUMMARY: '/analytics/spending',
  INCOME_SUMMARY: '/analytics/income',

  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',

  // Achievements
  ACHIEVEMENTS: '/achievements',
} as const;

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    { id: 'salary', label: 'Salary', icon: '💼' },
    { id: 'freelance', label: 'Freelance', icon: '💻' },
    { id: 'investment', label: 'Investment', icon: '📈' },
    { id: 'gift', label: 'Gift', icon: '🎁' },
    { id: 'other_income', label: 'Other', icon: '💰' },
  ],
  EXPENSE: [
    { id: 'food', label: 'Food & Drink', icon: '🍔' },
    { id: 'transport', label: 'Transportation', icon: '🚗' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'health', label: 'Health', icon: '💪' },
    { id: 'bills', label: 'Bills & Utilities', icon: '📱' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'other_expense', label: 'Other', icon: '💸' },
  ],
} as const;

export const GOAL_EMOJIS = [
  '🎯', '📱', '🏖️', '🎮', '🚗', '🏠',
  '💍', '🎓', '✈️', '💻', '📷', '🎸',
  '⌚', '👟', '🎨', '📖', '🏋️', '🎭',
] as const;

export const INVESTMENT_TYPES = [
  { id: 'stock', label: 'Stocks', icon: '📈' },
  { id: 'etf', label: 'ETFs', icon: '📊' },
  { id: 'crypto', label: 'Cryptocurrency', icon: '₿' },
  { id: 'bond', label: 'Bonds', icon: '📜' },
] as const;

export const RISK_LEVELS = {
  LOW: { label: 'Low', color: '#10B981' },
  MEDIUM: { label: 'Medium', color: '#F59E0B' },
  HIGH: { label: 'High', color: '#EF4444' },
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  GOAL_CREATED: 'Goal created successfully!',
  GOAL_UPDATED: 'Goal updated successfully!',
  GOAL_DELETED: 'Goal deleted successfully!',
  TRANSACTION_CREATED: 'Transaction added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
} as const;

// Export all constants from theme
export * from './theme';
