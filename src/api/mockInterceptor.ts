import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import apiConfig from '../config/api';
import {
  generateMockUser,
  generateMockGoals,
  generateMockCards,
  generateMockTransactions,
  generateMockInvestments,
  generateMockAchievements,
  generateMockNotifications,
  calculatePortfolioStats,
  calculateWalletBalance,
} from '../utils/mockData';

/**
 * Simulates network delay for more realistic mock responses
 */
function simulateNetworkDelay(): Promise<void> {
  const delay = Math.random() * 500 + 200; // 200-700ms
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Mock API responses based on endpoint
 */
async function getMockResponse(
  config: AxiosRequestConfig
): Promise<AxiosResponse | null> {
  await simulateNetworkDelay();

  const { method, url } = config;
  const path = url || '';

  // Auth endpoints
  if (path.includes('/auth/login')) {
    return {
      data: {
        user: generateMockUser(),
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  if (path.includes('/auth/register')) {
    return {
      data: {
        user: generateMockUser(),
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      },
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  if (path.includes('/auth/logout')) {
    return {
      data: { message: 'Logged out successfully' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Goals endpoints
  if (path.includes('/goals') && method === 'get') {
    if (path.match(/\/goals\/[^/]+$/)) {
      // Fetch single goal
      const goals = generateMockGoals(1);
      return {
        data: goals[0],
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    // Fetch all goals
    return {
      data: {
        goals: generateMockGoals(4),
        total: 4,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  if (path.includes('/goals') && method === 'post') {
    const newGoal = generateMockGoals(1)[0];
    return {
      data: { ...newGoal, ...config.data },
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  if (path.match(/\/goals\/[^/]+$/) && method === 'patch') {
    const goals = generateMockGoals(1);
    return {
      data: { ...goals[0], ...config.data },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  if (path.match(/\/goals\/[^/]+$/) && method === 'delete') {
    return {
      data: { message: 'Goal deleted successfully' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  if (path.includes('/goals/') && path.includes('/add-money')) {
    const goals = generateMockGoals(1);
    return {
      data: goals[0],
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Wallet endpoints
  if (path.includes('/wallet/cards')) {
    if (method === 'get') {
      return {
        data: generateMockCards(),
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (method === 'post') {
      const newCard = generateMockCards()[0];
      return {
        data: { ...newCard, ...config.data },
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
  }

  if (path.includes('/wallet/transactions')) {
    if (method === 'get') {
      const transactions = generateMockTransactions(20);
      return {
        data: {
          transactions,
          total: transactions.length,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (method === 'post') {
      const transactions = generateMockTransactions(1);
      return {
        data: { ...transactions[0], ...config.data },
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
  }

  if (path.includes('/wallet/balance')) {
    const cards = generateMockCards();
    return {
      data: {
        balance: calculateWalletBalance(cards),
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Investments endpoints
  if (path.includes('/investments') && method === 'get') {
    const investments = generateMockInvestments();
    const stats = calculatePortfolioStats(investments);
    return {
      data: {
        investments,
        ...stats,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  if (path.includes('/investments') && method === 'post') {
    const investments = generateMockInvestments();
    return {
      data: { ...investments[0], ...config.data },
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // User endpoints
  if (path.includes('/user/profile')) {
    if (method === 'get') {
      return {
        data: generateMockUser(),
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (method === 'patch') {
      return {
        data: { ...generateMockUser(), ...config.data },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  if (path.includes('/user/achievements')) {
    return {
      data: generateMockAchievements(),
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  if (path.includes('/user/notifications')) {
    const notifications = generateMockNotifications(5);
    const unreadCount = notifications.filter((n) => !n.read).length;
    return {
      data: {
        notifications,
        unreadCount,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  if (path.includes('/user/preferences')) {
    if (method === 'get') {
      return {
        data: {
          notifications: true,
          darkMode: true,
          currency: 'USD',
          language: 'en',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (method === 'patch') {
      return {
        data: config.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // Return null if no mock response found
  return null;
}

/**
 * Setup mock interceptor for Axios instance
 * This intercepts API calls and returns mock data when enabled
 */
export function setupMockInterceptor(axiosInstance: AxiosInstance): void {
  if (!apiConfig.useMockData) {
    console.log('🔧 Mock data is disabled');
    return;
  }

  console.log('🎭 Mock data is enabled - API calls will return mock responses');

  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      // Check if we should mock this request
      const mockResponse = await getMockResponse(config);

      if (mockResponse) {
        // Cancel the actual request and use mock response
        const cancelToken = new AbortController();
        cancelToken.abort();

        // Store mock response in config for response interceptor
        (config as any).__mockResponse = mockResponse;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // If request was cancelled for mock data, return the mock response
      const mockResponse = error.config?.__mockResponse;
      if (mockResponse) {
        return Promise.resolve(mockResponse);
      }

      return Promise.reject(error);
    }
  );
}

export default setupMockInterceptor;
