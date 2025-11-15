/**
 * SchoolStack.ai - Brand Tokens
 *
 * Central definitions for colors, typography, containers, gradients,
 * badges, and buttons. Components should reference these tokens so that
 * any future brand tweaks happen in one place.
 */

export const BRAND_COLORS = {
  primary: {
    hex: '#0A5F6F',
    text: 'text-primary-600',
    textStrong: 'text-primary-700',
    bg: 'bg-primary-600',
    border: 'border-primary-300',
    gradient: 'from-primary-600 to-primary-700'
  },
  accent: {
    hex: '#F59E0B',
    text: 'text-accent-600',
    textStrong: 'text-accent-700',
    bg: 'bg-accent-500',
    border: 'border-accent-300',
    gradient: 'from-accent-500 to-accent-600'
  },
  success: {
    hex: '#22C55E',
    text: 'text-success-600',
    bg: 'bg-success-600',
    border: 'border-success-300',
    gradient: 'from-success-600 to-success-700'
  },
  warning: {
    hex: '#F59E0B',
    text: 'text-amber-700',
    bg: 'bg-amber-500',
    border: 'border-amber-300'
  },
  critical: {
    hex: '#EF4444',
    text: 'text-red-600',
    bg: 'bg-red-600',
    border: 'border-red-300'
  },
  neutral: {
    surface: 'bg-white',
    surfaceAlt: 'bg-gray-50',
    border: 'border-gray-200',
    divider: 'border-gray-100',
    text: 'text-gray-700',
    textMuted: 'text-gray-500'
  }
};

export const CARD_VARIANTS = {
  surface: 'bg-white border border-gray-200 rounded-2xl shadow-sm',
  surfaceAlt: 'bg-gray-50 border border-gray-200 rounded-2xl shadow-sm',
  primaryGradient: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl shadow-lg',
  accentGradient: 'bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-2xl shadow-lg',
  successOutline: 'bg-white border border-success-200 rounded-2xl',
  neutralOutline: 'bg-white border border-gray-200 rounded-xl'
};

export const BADGE_VARIANTS = {
  good: 'bg-success-100 text-success-700',
  warning: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
  info: 'bg-primary-50 text-primary-700',
  neutral: 'bg-gray-100 text-gray-700'
};

export const BUTTON_VARIANTS = {
  primary: 'px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition',
  secondary: 'px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition',
  accent: 'px-4 py-2 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 transition',
  ghost: 'px-3 py-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition'
};

export const TYPOGRAPHY = {
  sectionEyebrow: 'text-xs uppercase tracking-wide text-gray-500 font-semibold',
  sectionHeading: 'text-lg font-semibold text-gray-900',
  pageHeading: 'text-3xl font-bold text-gray-900',
  body: 'text-sm text-gray-700',
  caption: 'text-xs text-gray-500'
};

export const GRADIENTS = {
  hero: 'bg-gradient-to-r from-primary-600 to-primary-500',
  coach: 'bg-gradient-to-r from-primary-100 to-primary-200',
  nudge: 'bg-gradient-to-r from-accent-100 to-amber-100'
};

export const STATUS_BORDERS = {
  good: 'border-success-300',
  warning: 'border-amber-300',
  critical: 'border-red-300',
  info: 'border-primary-300'
};

export const SHADOWS = {
  soft: 'shadow-soft',
  medium: 'shadow-medium',
  strong: 'shadow-strong'
};

export const BRAND_SURFACES = {
  page: 'bg-slate-50 min-h-screen',
  appShell: 'bg-white border border-gray-200 rounded-3xl'
};

/**
 * Utility helpers
 */
export const getStatusBadge = (status = 'good') => BADGE_VARIANTS[status] || BADGE_VARIANTS.neutral;

export const getCardVariant = (variant = 'surface') => CARD_VARIANTS[variant] || CARD_VARIANTS.surface;

export const getButtonVariant = (variant = 'primary') => BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;

