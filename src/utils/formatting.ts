import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Formatting utility functions
 */

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  showSymbol: boolean = true
): string => {
  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return showSymbol ? formatted : formatted.replace(/[^0-9,.]/g, '');
  } catch (error) {
    return `$${amount.toFixed(2)}`;
  }
};

export const formatNumber = (
  num: number,
  decimals: number = 0,
  compact: boolean = false
): string => {
  if (compact && Math.abs(num) >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (compact && Math.abs(num) >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (
  value: number,
  decimals: number = 2,
  includeSign: boolean = false
): string => {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatDate = (
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dateObj)) {
      return formatDistanceToNow(dateObj, { addSuffix: true });
    }

    if (isYesterday(dateObj)) {
      return 'Yesterday';
    }

    const daysDiff = Math.floor(
      (Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < 7) {
      return `${daysDiff} days ago`;
    }

    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    return 'Unknown';
  }
};

export const formatCardNumber = (cardNumber: string): string => {
  // Format: **** **** **** 1234
  const lastFour = cardNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
};

export const formatPhoneNumber = (phone: string): string => {
  // Format: (555) 123-4567
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;

  const visibleChars = Math.min(3, Math.floor(username.length / 2));
  const masked = username.substring(0, visibleChars) + '***';

  return `${masked}@${domain}`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};
