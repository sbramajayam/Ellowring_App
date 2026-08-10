/**
 * Ellowring Premium SaaS — Design Tokens
 * Mirror of CSS variables in `src/app/globals.css`
 */

export const colors = {
  primary: "#0F3DDE",
  secondary: "#111827",
  accent: "#2563EB",
  royal: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#2563EB",
    600: "#0F3DDE",
    700: "#0C32B8",
    800: "#0A2894",
    900: "#081F70",
  },
  navy: {
    700: "#1F2937",
    800: "#111827",
    900: "#0B1220",
  },
  white: "#FFFFFF",
  surface: {
    page: "#F8FAFC",
    card: "#FFFFFF",
    muted: "#F1F5F9",
    border: "#E2E8F0",
  },
  secondaryPalette: {
    red: "#DC2626",
    yellow: "#F59E0B",
    green: "#16A34A",
    sky: "#0EA5E9",
    purple: "#7C3AED",
  },
  text: {
    primary: "#111827",
    secondary: "#475569",
    muted: "#94A3B8",
    inverse: "#FFFFFF",
  },
  state: {
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#2563EB",
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
  sm: "0 1px 2px rgba(17, 24, 39, 0.05)",
  md: "0 4px 14px rgba(17, 24, 39, 0.08)",
  lg: "0 12px 32px rgba(17, 24, 39, 0.10)",
  xl: "0 24px 48px rgba(15, 61, 222, 0.14)",
  glow: "0 10px 30px rgba(15, 61, 222, 0.28)",
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
