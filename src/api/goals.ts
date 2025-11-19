import { api } from './client';
import { API_ENDPOINTS } from '../constants';
import { Goal, ApiResponse, PaginatedResponse } from '../types';

/**
 * Goals API Service
 */

export interface CreateGoalData {
  title: string;
  target: number;
  emoji: string;
  deadline: string;
  color: string;
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  current?: number;
}

export interface AddToGoalData {
  amount: number;
  transactionId?: string;
}

export const goalsApi = {
  /**
   * Get all goals for current user
   */
  getGoals: async (params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'completed' | 'all';
  }): Promise<PaginatedResponse<Goal>> => {
    return api.get<PaginatedResponse<Goal>>(API_ENDPOINTS.GOALS, { params });
  },

  /**
   * Get single goal by ID
   */
  getGoal: async (id: string): Promise<ApiResponse<Goal>> => {
    return api.get<ApiResponse<Goal>>(API_ENDPOINTS.GOAL_BY_ID(id));
  },

  /**
   * Create new goal
   */
  createGoal: async (data: CreateGoalData): Promise<ApiResponse<Goal>> => {
    return api.post<ApiResponse<Goal>>(API_ENDPOINTS.GOALS, data);
  },

  /**
   * Update existing goal
   */
  updateGoal: async (id: string, data: UpdateGoalData): Promise<ApiResponse<Goal>> => {
    return api.put<ApiResponse<Goal>>(API_ENDPOINTS.GOAL_BY_ID(id), data);
  },

  /**
   * Delete goal
   */
  deleteGoal: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.GOAL_BY_ID(id));
  },

  /**
   * Add money to goal
   */
  addToGoal: async (id: string, data: AddToGoalData): Promise<ApiResponse<Goal>> => {
    return api.post<ApiResponse<Goal>>(API_ENDPOINTS.ADD_TO_GOAL(id), data);
  },

  /**
   * Get goal progress/statistics
   */
  getGoalStats: async (id: string): Promise<
    ApiResponse<{
      totalSaved: number;
      percentComplete: number;
      daysRemaining: number;
      averagePerDay: number;
      onTrack: boolean;
    }>
  > => {
    return api.get<
      ApiResponse<{
        totalSaved: number;
        percentComplete: number;
        daysRemaining: number;
        averagePerDay: number;
        onTrack: boolean;
      }>
    >(`${API_ENDPOINTS.GOAL_BY_ID(id)}/stats`);
  },
};
