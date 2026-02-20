/**
 * Design Tokens V2 - Sistema Multi-Accent
 *
 * Este arquivo define o novo sistema de design com:
 * - Cores por área de negócio (Aquisição, Entrega, Operação)
 * - Elevation system (sombras em camadas)
 * - Motion design (animações profissionais)
 *
 * Fonte canônica para a V2.0 - Estilo Linear/Vercel
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ============================================
// CORES POR ÁREA DE NEGÓCIO
// ============================================

export const areaColors = {
  // Áreas principais
  acquisicao: {
    name: 'Aquisição',
    primary: '#8B5CF6',    // Violet
    light: '#EDE9FE',
    dark: '#6D28D9',
  },
  entrega: {
    name: 'Entrega',
    primary: '#10B981',   // Emerald
    light: '#D1FAE5',
    dark: '#059669',
  },
  operacao: {
    name: 'Operação',
    primary: '#F59E0B',   // Amber
    light: '#FEF3C7',
    dark: '#D97706',
  },
  // Cores neutras
  cinza: {
    name: 'Geral',
    primary: '#6B7280',   // Gray
    light: '#F3F4F6',
    dark: '#374151',
  },
} as const

export type AreaKey = keyof typeof areaColors

// ============================================
// CORES ACCENT (Múltiplas opções)
// ============================================

export const accentColors = {
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  rose: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E',
    600: '#E11D48',
    700: '#BE123C',
    800: '#9F1239',
    900: '#881337',
  },
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const

export type AccentName = keyof typeof accentColors

// ============================================
// STATUS COLORS
// ============================================

export const statusColors = {
  success: {
    bg: '#D1FAE5',
    text: '#065F46',
    border: '#10B981',
  },
  warning: {
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#F59E0B',
  },
  error: {
    bg: '#FEE2E2',
    text: '#991B1B',
    border: '#EF4444',
  },
  info: {
    bg: '#DBEAFE',
    text: '#1E40AF',
    border: '#3B82F6',
  },
  neutral: {
    bg: '#F3F4F6',
    text: '#374151',
    border: '#9CA3AF',
  },
} as const

export type StatusName = keyof typeof statusColors

// ============================================
// ELEVATION SYSTEM (Sombras em camadas)
// ============================================

export const elevation = {
  // Sem sombra - elementos inline
  none: 'none',

  // Level 1 - Elementos sobre o background
  // Uso: cards, botones secundarios
  level1: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)',

  // Level 2 - Elementos elevados
  // Uso: cards em hover, dropdowns
  level2: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

  // Level 3 - Elementos flutuantes
  // Uso: modais, popovers, tooltips
  level3: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

  // Level 4 - Elementos muito elevados
  // Uso: sidebars, overlays
  level4: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

  // Level 5 - Elementos críticos
  // Uso: modais grandes, dialogs
  level5: '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Inner shadow - elementos encaixados
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

export type ElevationLevel = keyof typeof elevation

// ============================================
// MOTION DESIGN (Animações)
// ============================================

export const motion = {
  // Durações
  duration: {
    instant: '0ms',
    fastest: '75ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slowest: '500ms',
  },

  // Easing curves
  easing: {
    // Linear
    linear: 'linear',

    // Suave - padrão para a maioria
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Acelerado - entrada de elementos
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',

    // Desacelerado - saída de elementos
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',

    // Elástico - para elementos que "saltam"
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Back - slight overshoot
    back: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Transições padrão
  transition: {
    // Para propriedades que mudam rápido (hover)
    hover: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Para transformações
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Para cores e opacidade
    color: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Para elementos que aparecem/desaparecem
    fade: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Para expansão de elementos
    expand: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Slide - para drawers e sidebars
    slide: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const

export type RadiusSize = keyof typeof radius

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  base: 0,
  docked: 10,
  dropdown: 20,
  sticky: 30,
  banner: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  tooltip: 80,
  toast: 90,
} as const

// ============================================
// ESPAÇAMENTO
// ============================================

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================
// HELPER: cn (className merge)
// ============================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// EXPORTS
// ============================================

export const tokensV2 = {
  areaColors,
  accentColors,
  statusColors,
  elevation,
  motion,
  radius,
  zIndex,
  spacing,
  breakpoints,
} as const

export default tokensV2
