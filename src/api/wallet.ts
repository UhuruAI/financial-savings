import apiClient from './client';
import { ApiResponse, Card, Transaction } from '../types';

export const walletApi = {
  /**
   * Fetch all cards for the current user
   */
  async fetchCards(): Promise<ApiResponse<Card[]>> {
    try {
      const response = await apiClient.get<Card[]>('/wallet/cards');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch cards',
      };
    }
  },

  /**
   * Add a new card
   */
  async addCard(cardData: {
    name: string;
    type: string;
    lastFour: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<ApiResponse<Card>> {
    try {
      const response = await apiClient.post<Card>('/wallet/cards', cardData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add card',
      };
    }
  },

  /**
   * Update a card
   */
  async updateCard(
    cardId: string,
    updates: Partial<Card>
  ): Promise<ApiResponse<Card>> {
    try {
      const response = await apiClient.patch<Card>(
        `/wallet/cards/${cardId}`,
        updates
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update card',
      };
    }
  },

  /**
   * Delete a card
   */
  async deleteCard(cardId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`/wallet/cards/${cardId}`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete card',
      };
    }
  },

  /**
   * Fetch transactions with optional filters
   */
  async fetchTransactions(params?: {
    limit?: number;
    offset?: number;
    cardId?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ transactions: Transaction[]; total: number }>> {
    try {
      const response = await apiClient.get<{
        transactions: Transaction[];
        total: number;
      }>('/wallet/transactions', { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transactions',
      };
    }
  },

  /**
   * Fetch a single transaction by ID
   */
  async fetchTransactionById(
    transactionId: string
  ): Promise<ApiResponse<Transaction>> {
    try {
      const response = await apiClient.get<Transaction>(
        `/wallet/transactions/${transactionId}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transaction',
      };
    }
  },

  /**
   * Create a new transaction (for manual entry)
   */
  async createTransaction(transactionData: {
    cardId: string;
    amount: number;
    category: string;
    description: string;
    merchant?: string;
    date?: string;
  }): Promise<ApiResponse<Transaction>> {
    try {
      const response = await apiClient.post<Transaction>(
        '/wallet/transactions',
        transactionData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create transaction',
      };
    }
  },

  /**
   * Get wallet balance
   */
  async fetchBalance(): Promise<ApiResponse<{ balance: number }>> {
    try {
      const response = await apiClient.get<{ balance: number }>(
        '/wallet/balance'
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch balance',
      };
    }
  },
};
