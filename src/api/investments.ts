import apiClient from './client';
import { ApiResponse, Investment } from '../types';

export const investmentsApi = {
  /**
   * Fetch all investments for the current user
   */
  async fetchInvestments(): Promise<
    ApiResponse<{
      investments: Investment[];
      portfolioValue: number;
      todayChange: number;
    }>
  > {
    try {
      const response = await apiClient.get<{
        investments: Investment[];
        portfolioValue: number;
        todayChange: number;
      }>('/investments');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch investments',
      };
    }
  },

  /**
   * Fetch a single investment by ID
   */
  async fetchInvestmentById(
    investmentId: string
  ): Promise<ApiResponse<Investment>> {
    try {
      const response = await apiClient.get<Investment>(
        `/investments/${investmentId}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch investment',
      };
    }
  },

  /**
   * Create a new investment
   */
  async createInvestment(investmentData: {
    symbol: string;
    name: string;
    type: string;
    amount: number;
  }): Promise<ApiResponse<Investment>> {
    try {
      const response = await apiClient.post<Investment>(
        '/investments',
        investmentData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create investment',
      };
    }
  },

  /**
   * Update an investment
   */
  async updateInvestment(
    investmentId: string,
    updates: Partial<Investment>
  ): Promise<ApiResponse<Investment>> {
    try {
      const response = await apiClient.patch<Investment>(
        `/investments/${investmentId}`,
        updates
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update investment',
      };
    }
  },

  /**
   * Delete an investment
   */
  async deleteInvestment(investmentId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`/investments/${investmentId}`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete investment',
      };
    }
  },

  /**
   * Buy more of an existing investment
   */
  async buyInvestment(
    investmentId: string,
    amount: number
  ): Promise<ApiResponse<Investment>> {
    try {
      const response = await apiClient.post<Investment>(
        `/investments/${investmentId}/buy`,
        { amount }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to buy investment',
      };
    }
  },

  /**
   * Sell part or all of an investment
   */
  async sellInvestment(
    investmentId: string,
    amount: number
  ): Promise<ApiResponse<Investment>> {
    try {
      const response = await apiClient.post<Investment>(
        `/investments/${investmentId}/sell`,
        { amount }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to sell investment',
      };
    }
  },

  /**
   * Get investment performance history
   */
  async fetchInvestmentHistory(
    investmentId: string,
    period: 'day' | 'week' | 'month' | 'year' | 'all' = 'month'
  ): Promise<
    ApiResponse<{
      data: Array<{ date: string; value: number }>;
    }>
  > {
    try {
      const response = await apiClient.get<{
        data: Array<{ date: string; value: number }>;
      }>(`/investments/${investmentId}/history`, {
        params: { period },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message || 'Failed to fetch investment history',
      };
    }
  },

  /**
   * Get portfolio performance over time
   */
  async fetchPortfolioHistory(
    period: 'day' | 'week' | 'month' | 'year' | 'all' = 'month'
  ): Promise<
    ApiResponse<{
      data: Array<{ date: string; value: number }>;
    }>
  > {
    try {
      const response = await apiClient.get<{
        data: Array<{ date: string; value: number }>;
      }>('/investments/portfolio/history', {
        params: { period },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message || 'Failed to fetch portfolio history',
      };
    }
  },
};
