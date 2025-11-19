import { User, Goal, Card, Transaction, Investment, Achievement, Notification } from '../types';

/**
 * Generate a random date between start and end dates
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Mock user data
 */
export function generateMockUser(): User {
  return {
    id: generateId(),
    email: 'demo@finsave.com',
    name: 'Alex Johnson',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main St, San Francisco, CA 94102',
    profilePicture: null,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generate mock goals
 */
export function generateMockGoals(count: number = 4): Goal[] {
  const goalTemplates = [
    { title: 'New iPhone 15', emoji: '📱', target: 1200, color: '#8B5CF6' },
    { title: 'Summer Vacation', emoji: '🏖️', target: 3000, color: '#EC4899' },
    { title: 'Gaming Setup', emoji: '🎮', target: 2500, color: '#10B981' },
    { title: 'Emergency Fund', emoji: '🛡️', target: 5000, color: '#F59E0B' },
    { title: 'New Laptop', emoji: '💻', target: 1800, color: '#3B82F6' },
    { title: 'Home Down Payment', emoji: '🏠', target: 50000, color: '#8B5CF6' },
    { title: 'Wedding Fund', emoji: '💍', target: 15000, color: '#EC4899' },
    { title: 'Education Fund', emoji: '🎓', target: 10000, color: '#10B981' },
  ];

  return goalTemplates.slice(0, count).map((template, index) => {
    const current = Math.random() * template.target;
    const daysToAdd = Math.floor(Math.random() * 180) + 30; // 30-210 days
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + daysToAdd);

    return {
      id: generateId(),
      userId: 'user-1',
      title: template.title,
      target: template.target,
      current: Math.floor(current),
      emoji: template.emoji,
      deadline: deadline.toISOString().split('T')[0],
      color: template.color,
      createdAt: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

/**
 * Generate mock cards
 */
export function generateMockCards(): Card[] {
  return [
    {
      id: generateId(),
      userId: 'user-1',
      name: 'Spending Card',
      type: 'Debit',
      lastFour: '4829',
      balance: 1247.89,
      isDefault: true,
      gradient: ['#8B5CF6', '#EC4899'],
      expiryMonth: '12',
      expiryYear: '2027',
      createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId: 'user-1',
      name: 'Savings Card',
      type: 'Savings',
      lastFour: '7234',
      balance: 3425.67,
      isDefault: false,
      gradient: ['#10B981', '#059669'],
      expiryMonth: '08',
      expiryYear: '2026',
      createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

/**
 * Generate mock transactions
 */
export function generateMockTransactions(count: number = 20): Transaction[] {
  const transactionTemplates = [
    { description: 'Coffee Shop', category: 'Food & Drink', icon: '☕', merchant: 'Starbucks', minAmount: 3, maxAmount: 15 },
    { description: 'Grocery Shopping', category: 'Food & Drink', icon: '🛒', merchant: 'Whole Foods', minAmount: 50, maxAmount: 200 },
    { description: 'Gas Station', category: 'Transportation', icon: '⛽', merchant: 'Shell', minAmount: 30, maxAmount: 80 },
    { description: 'Uber Ride', category: 'Transportation', icon: '🚗', merchant: 'Uber', minAmount: 8, maxAmount: 35 },
    { description: 'Online Shopping', category: 'Shopping', icon: '🛍️', merchant: 'Amazon', minAmount: 20, maxAmount: 150 },
    { description: 'Gym Membership', category: 'Health', icon: '💪', merchant: 'Planet Fitness', minAmount: 25, maxAmount: 50 },
    { description: 'Restaurant', category: 'Food & Drink', icon: '🍽️', merchant: 'Local Restaurant', minAmount: 25, maxAmount: 100 },
    { description: 'Movie Tickets', category: 'Entertainment', icon: '🎬', merchant: 'AMC Theaters', minAmount: 15, maxAmount: 40 },
    { description: 'Salary Deposit', category: 'Income', icon: '💼', merchant: 'Tech Corp', minAmount: 2000, maxAmount: 4000 },
    { description: 'Freelance Payment', category: 'Income', icon: '💰', merchant: 'Client', minAmount: 500, maxAmount: 2000 },
  ];

  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const template = transactionTemplates[Math.floor(Math.random() * transactionTemplates.length)];
    const isIncome = template.category === 'Income';
    const amount = Math.random() * (template.maxAmount - template.minAmount) + template.minAmount;
    const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    transactions.push({
      id: generateId(),
      userId: 'user-1',
      cardId: generateId(),
      amount: isIncome ? Math.floor(amount) : -Math.floor(amount),
      category: template.category,
      description: template.description,
      merchant: template.merchant,
      icon: template.icon,
      emoji: template.icon,
      status: 'completed',
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Generate mock investments
 */
export function generateMockInvestments(): Investment[] {
  const investmentTemplates = [
    { name: 'Tech Growth ETF', symbol: 'TECH', type: 'ETF', color: '#10B981' },
    { name: 'S&P 500 Index', symbol: 'SPY', type: 'Index Fund', color: '#3B82F6' },
    { name: 'Crypto Bundle', symbol: 'CRYPTO', type: 'Cryptocurrency', color: '#F59E0B' },
    { name: 'Clean Energy', symbol: 'CLEAN', type: 'ETF', color: '#10B981' },
    { name: 'Real Estate', symbol: 'REIT', type: 'REIT', color: '#8B5CF6' },
  ];

  return investmentTemplates.map((template) => {
    const initialValue = Math.random() * 2000 + 200;
    const changePercent = (Math.random() - 0.4) * 10; // -4% to +6%
    const change = initialValue * (changePercent / 100);

    return {
      id: generateId(),
      userId: 'user-1',
      symbol: template.symbol,
      name: template.name,
      type: template.type,
      currentValue: Math.floor(initialValue),
      change: Math.floor(change),
      changePercent: parseFloat(changePercent.toFixed(2)),
      shares: parseFloat((initialValue / (50 + Math.random() * 200)).toFixed(4)),
      averagePrice: parseFloat((50 + Math.random() * 200).toFixed(2)),
      color: template.color,
      allocation: Math.floor(Math.random() * 30) + 10, // 10-40%
      createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

/**
 * Generate mock achievements
 */
export function generateMockAchievements(): Achievement[] {
  return [
    {
      id: generateId(),
      userId: 'user-1',
      title: 'First Goal',
      description: 'Created your first savings goal',
      emoji: '🎯',
      icon: 'target',
      unlocked: true,
      unlockedAt: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId: 'user-1',
      title: 'Saver',
      description: 'Saved $1,000 total',
      emoji: '💰',
      icon: 'dollar-sign',
      unlocked: true,
      unlockedAt: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId: 'user-1',
      title: 'Investor',
      description: 'Made your first investment',
      emoji: '📈',
      icon: 'trending-up',
      unlocked: true,
      unlockedAt: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId: 'user-1',
      title: 'Streak Master',
      description: 'Saved for 30 days in a row',
      emoji: '🔥',
      icon: 'flame',
      unlocked: true,
      unlockedAt: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId: 'user-1',
      title: 'Big Spender',
      description: 'Saved $10,000 total',
      emoji: '💎',
      icon: 'gem',
      unlocked: false,
      unlockedAt: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId: 'user-1',
      title: 'Money Master',
      description: 'Completed 10 goals',
      emoji: '👑',
      icon: 'crown',
      unlocked: false,
      unlockedAt: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];
}

/**
 * Generate mock notifications
 */
export function generateMockNotifications(count: number = 5): Notification[] {
  const notificationTemplates = [
    { title: 'Goal Achieved!', message: 'Congratulations! You reached your Summer Vacation goal!', type: 'success' as const },
    { title: 'Payment Received', message: 'Your salary of $2,500 has been deposited', type: 'success' as const },
    { title: 'Low Balance Alert', message: 'Your balance is below $100', type: 'warning' as const },
    { title: 'Goal Milestone', message: 'You are 50% closer to your iPhone goal!', type: 'info' as const },
    { title: 'Investment Update', message: 'Your Tech ETF is up 5% this week', type: 'success' as const },
    { title: 'New Achievement', message: 'You unlocked the Saver achievement!', type: 'success' as const },
    { title: 'Spending Alert', message: 'You spent $150 on dining this week', type: 'info' as const },
  ];

  const notifications: Notification[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const template = notificationTemplates[i % notificationTemplates.length];
    const hoursAgo = i * 4 + Math.floor(Math.random() * 4); // Spread out over time
    const date = new Date(now);
    date.setHours(date.getHours() - hoursAgo);

    notifications.push({
      id: generateId(),
      userId: 'user-1',
      title: template.title,
      message: template.message,
      type: template.type,
      read: i > 2, // First 3 unread
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  return notifications;
}

/**
 * Calculate mock portfolio value from investments
 */
export function calculatePortfolioStats(investments: Investment[]): {
  portfolioValue: number;
  todayChange: number;
} {
  const portfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const todayChange = investments.reduce((sum, inv) => sum + inv.change, 0);

  return {
    portfolioValue,
    todayChange,
  };
}

/**
 * Calculate wallet balance from cards
 */
export function calculateWalletBalance(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.balance, 0);
}

/**
 * Generate all mock data at once
 */
export function generateAllMockData() {
  const user = generateMockUser();
  const goals = generateMockGoals(4);
  const cards = generateMockCards();
  const transactions = generateMockTransactions(20);
  const investments = generateMockInvestments();
  const achievements = generateMockAchievements();
  const notifications = generateMockNotifications(5);
  const portfolioStats = calculatePortfolioStats(investments);
  const balance = calculateWalletBalance(cards);

  return {
    user,
    goals,
    cards,
    transactions,
    investments,
    achievements,
    notifications,
    balance,
    ...portfolioStats,
  };
}
