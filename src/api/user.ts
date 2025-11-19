import apiClient from './client';
import { ApiResponse, User, Achievement, Notification, UserPreferences } from '../types';

export const userApi = {
  /**
   * Fetch current user profile
   */
  async fetchProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>('/user/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.patch<User>('/user/profile', updates);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(imageUri: string): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await apiClient.post<{ url: string }>(
        '/user/profile/picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload picture',
      };
    }
  },

  /**
   * Fetch user achievements
   */
  async fetchAchievements(): Promise<ApiResponse<Achievement[]>> {
    try {
      const response = await apiClient.get<Achievement[]>('/user/achievements');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch achievements',
      };
    }
  },

  /**
   * Fetch user notifications
   */
  async fetchNotifications(params?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }): Promise<ApiResponse<{ notifications: Notification[]; unreadCount: number }>> {
    try {
      const response = await apiClient.get<{
        notifications: Notification[];
        unreadCount: number;
      }>('/user/notifications', { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch notifications',
      };
    }
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.patch(`/user/notifications/${notificationId}/read`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark notification as read',
      };
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<ApiResponse<void>> {
    try {
      await apiClient.patch('/user/notifications/read-all');
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark all notifications as read',
      };
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`/user/notifications/${notificationId}`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete notification',
      };
    }
  },

  /**
   * Fetch user preferences
   */
  async fetchPreferences(): Promise<ApiResponse<UserPreferences>> {
    try {
      const response = await apiClient.get<UserPreferences>('/user/preferences');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch preferences',
      };
    }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(
    preferences: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    try {
      const response = await apiClient.patch<UserPreferences>(
        '/user/preferences',
        preferences
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update preferences',
      };
    }
  },

  /**
   * Change password
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/user/change-password', data);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password',
      };
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/user/password-reset/request', { email });
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to request password reset',
      };
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/user/password-reset/confirm', data);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password',
      };
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/user/delete-account', { password });
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete account',
      };
    }
  },
};
