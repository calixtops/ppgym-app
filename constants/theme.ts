/**
 * PPGym App Theme Configuration
 * Modern and elegant color scheme for fitness tracking app
 */

import { Platform } from 'react-native';

const tintColorLight = '#f25924'; // Orange accent
const tintColorDark = '#f25924'; // Orange accent

export const Colors = {
  light: {
    text: '#1a1a1a', // Darker text for better contrast
    textSecondary: '#6b7280', // Gray-500
    background: '#fafafa', // Slightly off-white
    backgroundSecondary: '#f5f5f5', // Light gray
    surface: '#ffffff',
    surfaceSecondary: '#f8f9fa', // Very light gray
    tint: tintColorLight,
    primary: '#f25924', // Orange accent
    secondary: '#2f2b36', // Dark base
    success: '#10b981', // Emerald-500
    warning: '#f59e0b', // Amber-500
    error: '#ef4444', // Red-500
    icon: '#6b7280', // Gray-500
    iconActive: tintColorLight,
    border: '#e1e5e9', // Slightly darker border
    tabIconDefault: '#9ca3af', // Gray-400
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    text: '#ffffff', // Pure white for better contrast
    textSecondary: '#b0b0b0', // Light gray
    background: '#1a1a1a', // Very dark background
    backgroundSecondary: '#2a2a2a', // Slightly lighter
    surface: '#2f2b36', // Dark surface
    surfaceSecondary: '#3a3441', // Secondary surface
    tint: tintColorDark,
    primary: '#f25924', // Orange accent
    secondary: '#3a3441', // Secondary surface color
    success: '#34d399', // Emerald-400
    warning: '#fbbf24', // Amber-400
    error: '#f87171', // Red-400
    icon: '#b0b0b0', // Light gray
    iconActive: tintColorDark,
    border: '#404040', // Dark border
    tabIconDefault: '#6b7280', // Gray-500
    tabIconSelected: tintColorDark,
    card: '#2f2b36', // Card background
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  xxl: 12,
  full: 9999,
};

export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
