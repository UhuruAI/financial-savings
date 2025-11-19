import { api } from './client';
import { API_ENDPOINTS } from '../constants';
import { User, LoginFormData, RegisterFormData, ApiResponse } from '../types';

/**
 * Authentication API Service
 */

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginFormData): Promise<ApiResponse<LoginResponse>> => {
    return api.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.LOGIN, credentials);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterFormData): Promise<ApiResponse<RegisterResponse>> => {
    return api.post<ApiResponse<RegisterResponse>>(API_ENDPOINTS.REGISTER, data);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return api.post<ApiResponse<void>>(API_ENDPOINTS.LOGOUT);
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string }>> => {
    return api.post<ApiResponse<{ token: string }>>(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return api.post<ApiResponse<void>>(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return api.post<ApiResponse<void>>(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return api.post<ApiResponse<void>>(API_ENDPOINTS.VERIFY_EMAIL, { token });
  },
};
