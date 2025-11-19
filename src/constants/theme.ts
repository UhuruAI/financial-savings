// Theme Constants

export const COLORS = {
  // Primary Colors
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',

  // Secondary Colors
  secondary: '#EC4899',
  secondaryDark: '#DB2777',
  secondaryLight: '#F472B6',

  // Accent Colors
  accent: '#F59E0B',
  accentDark: '#D97706',
  accentLight: '#FBBF24',

  // Status Colors
  success: '#10B981',
  successDark: '#059669',
  successLight: '#34D399',

  error: '#EF4444',
  errorDark: '#DC2626',
  errorLight: '#F87171',

  warning: '#F59E0B',
  warningDark: '#D97706',
  warningLight: '#FBBF24',

  info: '#3B82F6',
  infoDark: '#2563EB',
  infoLight: '#60A5FA',

  // Neutral Colors (Dark Theme)
  background: '#0F172A',
  backgroundLight: '#1E293B',
  backgroundLighter: '#334155',

  surface: '#1E293B',
  surfaceLight: '#334155',
  surfaceLighter: '#475569',

  border: '#374151',
  borderLight: '#475569',

  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',

  // UI Elements
  card: '#1E293B',
  cardBorder: '#374151',

  input: '#374151',
  inputBorder: '#475569',
  inputFocus: '#8B5CF6',

  disabled: '#6B7280',
  disabledLight: '#9CA3AF',

  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Gradients
  gradients: {
    primary: ['#8B5CF6', '#EC4899'],
    secondary: ['#EC4899', '#F59E0B'],
    success: ['#10B981', '#059669'],
    accent: ['#F59E0B', '#EF4444'],
    investment: ['#3B82F6', '#8B5CF6'],
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 36,
} as const;

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const BREAKPOINTS = {
  small: 375,
  medium: 768,
  large: 1024,
} as const;

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'ease-in-out',
    spring: 'spring',
  },
} as const;
