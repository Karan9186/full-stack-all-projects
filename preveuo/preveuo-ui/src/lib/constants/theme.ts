/**
 * Preveuo Design System — Centralized Theme & Color Tokens
 *
 * Mandatory tokens for all UI elements, hotspots, canvas objects, and themes.
 * Eliminates static/hardcoded hex strings across the project.
 */

export const THEME_COLORS = {
  // Brand Primary
  primary: '#5B5CE2',
  primaryHover: '#4a4bd4',
  primaryLight: 'rgba(91, 92, 226, 0.1)',
  primaryLightHover: 'rgba(91, 92, 226, 0.15)',
  primaryMuted: '#9394f8',
  primaryGlow: 'rgba(91, 92, 226, 0.4)',
  primaryRgba: (alpha: number) => `rgba(91, 92, 226, ${alpha})`,

  // Neutrals & Surface Colors
  white: '#ffffff',
  bgLight: '#f8f8fc',
  bgCanvas: '#fafafc',
  bgDark: '#0f0f1a',
  footerDark: '#121214',

  // Typography
  textHeading: '#0f0f1a',
  textBody: '#6b7280',
  textLabel: '#5B5CE2',
  textMuted: '#9ca3af',
  textWhite: '#ffffff',

  // Borders & Dividers
  borderDefault: '#e5e7eb',
  borderLight: '#f0f0f4',
  borderInput: '#d1d5db',

  // Semantic Status
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
} as const;

export const PRIMARY_COLOR = THEME_COLORS.primary;
export const PRIMARY_COLOR_HOVER = THEME_COLORS.primaryHover;
export const DEFAULT_HOTSPOT_COLOR = THEME_COLORS.primary;
export const BORDER_DEFAULT_COLOR = THEME_COLORS.borderDefault;
export const BORDER_LIGHT_COLOR = THEME_COLORS.borderLight;
export const BORDER_INPUT_COLOR = THEME_COLORS.borderInput;
export const TEXT_HEADING_COLOR = THEME_COLORS.textHeading;
export const TEXT_BODY_COLOR = THEME_COLORS.textBody;
export const TEXT_MUTED_COLOR = THEME_COLORS.textMuted;
export const BG_LIGHT_COLOR = THEME_COLORS.bgLight;
export const BG_CANVAS_COLOR = THEME_COLORS.bgCanvas;
export const BG_DARK_COLOR = THEME_COLORS.bgDark;
export const WHITE_COLOR = THEME_COLORS.white;
export const SUCCESS_COLOR = THEME_COLORS.success;
export const WARNING_COLOR = THEME_COLORS.warning;
export const DANGER_COLOR = THEME_COLORS.danger;
export const INFO_COLOR = THEME_COLORS.info;

export const PRESET_HOTSPOT_COLORS = [
  THEME_COLORS.bgDark,
  THEME_COLORS.primary,
  THEME_COLORS.info,
  THEME_COLORS.success,
  THEME_COLORS.warning,
  THEME_COLORS.danger,
] as const;

export const PRESET_TEXT_COLORS = [
  THEME_COLORS.white,
  THEME_COLORS.bgLight,
  THEME_COLORS.borderDefault,
  THEME_COLORS.bgDark,
  THEME_COLORS.textBody,
] as const;

export type ThemeColorKey = keyof typeof THEME_COLORS;

