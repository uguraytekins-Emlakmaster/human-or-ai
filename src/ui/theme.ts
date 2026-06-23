/**
 * Premium UI theme: Apple / Notion / Stripe inspired, dark-mode friendly.
 */

export const colors = {
  background: '#0a0a0f',
  surface: '#12121a',
  surfaceElevated: '#1a1a24',
  border: '#2a2a36',
  text: '#f4f4f5',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  primary: '#6366f1',
  primaryGlow: 'rgba(99, 102, 241, 0.35)',
  real: '#22c55e',
  realGlow: 'rgba(34, 197, 94, 0.35)',
  ai: '#f43f5e',
  aiGlow: 'rgba(244, 63, 94, 0.35)',
  correct: '#22c55e',
  wrong: '#ef4444',
  streak: '#eab308',
  streakGlow: 'rgba(234, 179, 8, 0.35)',
  white: '#ffffff',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const },
  titleLarge: { fontSize: 34, fontWeight: '700' as const },
  headline: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  button: { fontSize: 17, fontWeight: '600' as const },
} as const;

export const animation = {
  fast: 200,
  normal: 280,
  slow: 350,
} as const;
