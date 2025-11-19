// Core Types and Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  target: number;
  current: number;
  emoji: string;
  deadline: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense' | 'savings' | 'investment';
  title: string;
  amount: number;
  category: string;
  merchant?: string;
  icon?: string;
  cardId?: string;
  goalId?: string;
  timestamp: string;
  createdAt: string;
}

export interface Card {
  id: string;
  userId: string;
  name: string;
  type: 'debit' | 'credit' | 'savings';
  balance: number;
  lastFour: string;
  gradient: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  symbol: string;
  value: number;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'etf' | 'crypto' | 'bond';
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteria: {
    type: string;
    value: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'goal' | 'investment' | 'security' | 'general';
  read: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface CreateGoalFormData {
  title: string;
  target: string;
  deadline: string;
  emoji: string;
}

// Navigation Types
export type RootStackParamList = {
  '(tabs)': undefined;
  '+not-found': undefined;
};

export type TabParamList = {
  index: undefined;
  goals: undefined;
  invest: undefined;
  wallet: undefined;
  profile: undefined;
};

// State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
}

export interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface WalletState {
  cards: Card[];
  balance: number;
  isLoading: boolean;
  error: string | null;
}

export interface InvestmentsState {
  investments: Investment[];
  portfolioValue: number;
  isLoading: boolean;
  error: string | null;
}
