import Constants from 'expo-constants';

/**
 * API Configuration
 * This file manages API endpoints and configuration for different environments
 */

export type Environment = 'development' | 'staging' | 'production';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  useMockData: boolean;
  environment: Environment;
}

/**
 * Get the current environment
 */
function getEnvironment(): Environment {
  const env = process.env.EXPO_PUBLIC_ENVIRONMENT || Constants.expoConfig?.extra?.environment;

  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  return 'development';
}

/**
 * Environment-specific API URLs
 */
const API_URLS: Record<Environment, string> = {
  development: process.env.EXPO_PUBLIC_API_URL_DEV || 'http://localhost:3000/api',
  staging: process.env.EXPO_PUBLIC_API_URL_STAGING || 'https://staging-api.finsave.com/api',
  production: process.env.EXPO_PUBLIC_API_URL_PROD || 'https://api.finsave.com/api',
};

/**
 * Check if we should use mock data
 * In development, you can use mock data by setting EXPO_PUBLIC_USE_MOCK_DATA=true
 */
function shouldUseMockData(): boolean {
  const environment = getEnvironment();
  const useMockEnv = process.env.EXPO_PUBLIC_USE_MOCK_DATA;

  // Always use mock data in development unless explicitly disabled
  if (environment === 'development') {
    return useMockEnv !== 'false';
  }

  // Never use mock data in production
  if (environment === 'production') {
    return false;
  }

  // Staging can use mock data if explicitly enabled
  return useMockEnv === 'true';
}

/**
 * Get API configuration for current environment
 */
export function getApiConfig(): ApiConfig {
  const environment = getEnvironment();

  return {
    baseURL: API_URLS[environment],
    timeout: 30000, // 30 seconds
    useMockData: shouldUseMockData(),
    environment,
  };
}

/**
 * API feature flags
 */
export const API_FEATURES = {
  // Enable/disable specific API features
  authentication: true,
  goals: true,
  wallet: true,
  investments: true,
  notifications: true,
  achievements: true,

  // Feature-specific settings
  autoSave: true,
  offlineMode: true,
  pushNotifications: true,
  biometricAuth: false, // Coming soon
};

/**
 * API rate limiting configuration
 */
export const RATE_LIMITS = {
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
  backoffMultiplier: 2,
};

/**
 * Request timeout configurations for different operations
 */
export const TIMEOUTS = {
  default: 30000,
  upload: 60000, // File uploads may take longer
  download: 60000,
  longRunning: 120000, // For operations like data export
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof API_FEATURES): boolean {
  return API_FEATURES[feature] || false;
}

/**
 * Debug utility to log API configuration (development only)
 */
export function logApiConfig() {
  if (__DEV__) {
    const config = getApiConfig();
    console.log('🔧 API Configuration:', {
      environment: config.environment,
      baseURL: config.baseURL,
      useMockData: config.useMockData,
      timeout: config.timeout,
    });
  }
}

export default getApiConfig();
