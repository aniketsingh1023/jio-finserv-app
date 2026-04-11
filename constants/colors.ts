/**
 * Color Theme for Jio Finserv
 * Mobile-first, warm and inviting palette
 */

export const Colors = {
  // Primary Brand Colors
  primary: '#D58F16', // Warm Mustard Orange
  secondary: '#CDC58E', // Soft Olive Beige
  accent: '#F1B643', // Golden Yellow
  
  // Neutral Colors
  lightGray: '#BDBBBC', // Light Cool Gray
  darkCharcoal: '#252A39', // Dark Navy Charcoal
  
  // Extended Palette
  white: '#FFFFFF',
  black: '#000000',
  
  // Backgrounds
  background: '#F8F7F4',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#F0EEEB',
  
  // Text Colors
  textPrimary: '#252A39',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textLight: '#FFFFFF',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Borders & Dividers
  border: '#E0DDD9',
  divider: '#F0EEEB',
  
  // Shadows
  shadowColor: '#000000',
} as const;

export type ColorNames = keyof typeof Colors;
