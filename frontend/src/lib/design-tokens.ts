/**
 * Ellowring Phase 6 — Design Tokens (source of truth for TS consumers)
 * Mirror of CSS variables in `src/app/globals.css`
 * Spec: docs/Ellowring_UI_UX_Design_System.md
 */

export const colors = {
  royal: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB", // Primary Royal Blue
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },
  navy: {
    700: "#123056",
    800: "#0B1F3A", // Dark Navy
    900: "#071526",
  },
  white: "#FFFFFF",
  surface: {
    page: "#F4F7FB",
    card: "#FFFFFF",
    muted: "#F8FAFC",
    border: "#E2E8F0",
  },
  secondary: {
    red: "#EF4444",
    yellow: "#F59E0B",
    green: "#10B981",
    sky: "#0EA5E9",
    purple: "#8B5CF6",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    muted: "#94A3B8",
    inverse: "#FFFFFF",
  },
  state: {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#0EA5E9",
  },
} as const;

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  full: "9999px",
} as const;

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
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.05)",
  md: "0 4px 12px rgba(15, 23, 42, 0.08)",
  lg: "0 12px 32px rgba(15, 23, 42, 0.10)",
  xl: "0 24px 48px rgba(11, 31, 58, 0.14)",
  glow: "0 10px 30px rgba(37, 99, 235, 0.28)",
} as const;

export const fonts = {
  sans: "var(--font-jakarta), var(--font-inter), system-ui, sans-serif",
  display: "var(--font-jakarta), system-ui, sans-serif",
  body: "var(--font-inter), system-ui, sans-serif",
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const motion = {
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
  ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
} as const;

export const designTokens = {
  colors,
  radii,
  space,
  shadows,
  fonts,
  breakpoints,
  motion,
} as const;

export default designTokens;
