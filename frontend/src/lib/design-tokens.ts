/**
 * Ellowring Phase 6 — Design Tokens (TypeScript)
 * Source of truth (must stay in parity with `frontend/src/app/globals.css`).
 * Spec: docs/Ellowring_UI_UX_Design_System.md §19
 */

export const colors = {
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },
  secondary: {
    red: { 500: "#EF4444", 700: "#B91C1C" },
    yellow: { 500: "#F59E0B", 700: "#B45309" },
    green: { 500: "#22C55E", 700: "#15803D" },
    sky: { 500: "#0EA5E9", 700: "#0369A1" },
    purple: { 500: "#8B5CF6", 700: "#6D28D9" },
  },
  neutral: {
    white: "#FFFFFF",
    navy: {
      950: "#0B1F3A",
      900: "#102A4C",
      800: "#16345E",
      700: "#1D4270",
    },
    slate: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
    },
  },
  /** Semantic aliases used in components */
  brand: "#2563EB",
  royal: "#0F3DDE",
  canvas: "#F1F5F9",
  surface: "#FFFFFF",
  ink: "#0B1F3A",
  inkMuted: "#475569",
  border: "#E2E8F0",
  success: "#15803D",
  warning: "#B45309",
  danger: "#B91C1C",
  info: "#0369A1",
  premium: "#8B5CF6",
} as const;

/** @deprecated Prefer `colors.primary` — kept for existing imports */
export const royal = {
  50: colors.primary[50],
  100: colors.primary[100],
  200: colors.primary[200],
  300: colors.primary[300],
  400: colors.primary[400],
  500: colors.primary[600],
  600: "#0F3DDE",
  700: colors.primary[700],
  800: colors.primary[800],
  900: colors.primary[900],
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  full: 999,
} as const;

/** String px maps for inline styles / CSS-in-JS */
export const radii = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  full: "9999px",
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/** @deprecated Prefer `spacing` numeric map */
export const space = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

export const shadows = {
  xs: "0 1px 2px rgba(11, 31, 58, 0.04)",
  sm: "0 2px 8px rgba(11, 31, 58, 0.06)",
  md: "0 8px 24px rgba(11, 31, 58, 0.08)",
  lg: "0 16px 40px rgba(11, 31, 58, 0.10)",
  xl: "0 24px 60px rgba(11, 31, 58, 0.14)",
  "2xl": "0 32px 80px rgba(11, 31, 58, 0.18)",
  focus: "0 0 0 3px rgba(37, 99, 235, 0.35)",
  glow: "0 10px 30px rgba(37, 99, 235, 0.28)",
} as const;

export const elevation = {
  0: "none",
  1: shadows.xs,
  2: shadows.sm,
  3: shadows.md,
  4: shadows.lg,
  5: shadows.xl,
  6: shadows["2xl"],
} as const;

export const fonts = {
  display: "var(--font-display)",
  body: "var(--font-body)",
  sans: "var(--font-body)",
} as const;

export const typography = {
  displayXl: { fontFamily: "var(--font-display)", size: 56, weight: 800, lineHeight: 1.08, letterSpacing: "-0.02em" },
  displayLg: { fontFamily: "var(--font-display)", size: 48, weight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" },
  displayMd: { fontFamily: "var(--font-display)", size: 40, weight: 700, lineHeight: 1.12, letterSpacing: "-0.015em" },
  h1: { fontFamily: "var(--font-display)", size: 36, weight: 700, lineHeight: 1.15, letterSpacing: "-0.01em" },
  h2: { fontFamily: "var(--font-display)", size: 30, weight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" },
  h3: { fontFamily: "var(--font-display)", size: 24, weight: 700, lineHeight: 1.25 },
  h4: { fontFamily: "var(--font-display)", size: 20, weight: 600, lineHeight: 1.3 },
  bodyLg: { fontFamily: "var(--font-body)", size: 18, weight: 400, lineHeight: 1.55 },
  body: { fontFamily: "var(--font-body)", size: 16, weight: 400, lineHeight: 1.55 },
  bodySm: { fontFamily: "var(--font-body)", size: 14, weight: 400, lineHeight: 1.5 },
  caption: { fontFamily: "var(--font-body)", size: 12, weight: 500, lineHeight: 1.4 },
  overline: { fontFamily: "var(--font-body)", size: 11, weight: 700, lineHeight: 1.3, letterSpacing: "0.06em" },
  label: { fontFamily: "var(--font-body)", size: 13, weight: 600, lineHeight: 1.4 },
  buttonLg: { fontFamily: "var(--font-display)", size: 16, weight: 600, lineHeight: 1 },
  buttonMd: { fontFamily: "var(--font-display)", size: 14, weight: 600, lineHeight: 1 },
  buttonSm: { fontFamily: "var(--font-display)", size: 12, weight: 600, lineHeight: 1 },
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
} as const;

export const motion = {
  instant: "80ms",
  fast: "120ms",
  base: "180ms",
  moderate: "240ms",
  slow: "320ms",
  ease: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    premium: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  },
} as const;

export const gradients = {
  brand: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)",
  navy: "linear-gradient(180deg, #0B1F3A 0%, #122F6B 100%)",
  meshMarketing:
    "radial-gradient(at 20% 20%, rgba(37,99,235,0.12) 0, transparent 50%), radial-gradient(at 80% 0%, rgba(14,165,233,0.10) 0, transparent 40%), radial-gradient(at 80% 80%, rgba(139,92,246,0.08) 0, transparent 45%)",
  ringProgress: "linear-gradient(90deg, #22C55E 0%, #38BDF8 100%)",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 40,
  sticky: 50,
  overlay: 60,
  modal: 70,
  toast: 80,
  max: 100,
} as const;

/** Legacy flat aliases used across older components */
export const legacyColors = {
  primary: "#0F3DDE",
  secondary: "#111827",
  accent: "#2563EB",
  white: "#FFFFFF",
  surface: {
    page: "#F8FAFC",
    card: "#FFFFFF",
    muted: "#F1F5F9",
    border: "#E2E8F0",
  },
  secondaryPalette: {
    red: "#EF4444",
    yellow: "#F59E0B",
    green: "#22C55E",
    sky: "#0EA5E9",
    purple: "#8B5CF6",
  },
  text: {
    primary: "#0B1F3A",
    secondary: "#475569",
    muted: "#94A3B8",
    inverse: "#FFFFFF",
  },
  state: {
    success: "#15803D",
    warning: "#B45309",
    danger: "#B91C1C",
    info: "#0369A1",
  },
} as const;

export const designTokens = {
  colors,
  royal,
  radius,
  radii,
  spacing,
  space,
  shadows,
  elevation,
  fonts,
  typography,
  breakpoints,
  motion,
  gradients,
  zIndex,
  legacyColors,
} as const;

export default designTokens;
