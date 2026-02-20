/**
 * Design Tokens - Fonte Canônica
 *
 * Este arquivo é a fonte canônica de todos os tokens de design do projeto.
 * As cores aqui definidas são refletidas em:
 * - tailwind.config.ts (para uso em classes)
 * - globals.css (CSS variables para theming)
 */

export const tokens = {
  // ============================================
  // CORES
  // ============================================
  colors: {
    // Brand / Accent (Violet)
    accent: {
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

    // Backgrounds (Light/Dark)
    background: {
      page: 'var(--background)',      // #F8F9FA / #111827
      card: 'var(--card)',            // #FFFFFF / #1F2937
      hover: 'var(--muted)',          // #F3F4F6 / #374151
    },

    // Text
    text: {
      primary: 'var(--foreground)',   // #1F2937 / #F9FAFB
      secondary: 'var(--muted-foreground)', // #6B7280 / #9CA3AF
      muted: '#9CA3AF',
    },

    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },

    // Borders
    border: {
      light: '#F3F4F6',
      DEFAULT: '#E5E7EB',
      strong: '#D1D5DB',
      dark: '#374151',
    },
  },

  // ============================================
  // TIPOGRAFIA
  // ============================================
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // ============================================
  // ESPAÇAMENTO
  // ============================================
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // ============================================
  // SOMBRAS
  // ============================================
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    panel: '0 10px 25px rgba(0,0,0,0.15)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },

  // ============================================
  // ANIMAÇÕES
  // ============================================
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      DEFAULT: 'ease-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // ============================================
  // Z-INDEX
  // ============================================
  zIndex: {
    dropdown: 50,
    sticky: 100,
    modal: 200,
    popover: 300,
    tooltip: 400,
  },
} as const

// Tipos exportados para uso em TypeScript
export type AccentShade = keyof typeof tokens.colors.accent
export type SpacingSize = keyof typeof tokens.spacing
export type RadiusSize = keyof typeof tokens.radius
export type ShadowSize = keyof typeof tokens.shadows

export default tokens
