/**
 * Cosmetic UI themes: Dark, Neon, Minimal.
 * Unlock via XP or coins; applied across the app.
 */

import type { ThemeId } from '../logic/types';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryGlow: string;
  real: string;
  realGlow: string;
  ai: string;
  aiGlow: string;
  correct: string;
  wrong: string;
  streak: string;
  streakGlow: string;
  white: string;
  black: string;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  dark: {
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
  },
  neon: {
    background: '#0d0d14',
    surface: '#16162a',
    surfaceElevated: '#1e1e3a',
    border: '#2d2d4a',
    text: '#e8e8ff',
    textSecondary: '#a0a0d0',
    textMuted: '#7070a0',
    primary: '#00ffcc',
    primaryGlow: 'rgba(0, 255, 204, 0.4)',
    real: '#00ff88',
    realGlow: 'rgba(0, 255, 136, 0.4)',
    ai: '#ff0080',
    aiGlow: 'rgba(255, 0, 128, 0.4)',
    correct: '#00ff88',
    wrong: '#ff4444',
    streak: '#ffcc00',
    streakGlow: 'rgba(255, 204, 0, 0.4)',
    white: '#ffffff',
    black: '#000000',
  },
  minimal: {
    background: '#fafafa',
    surface: '#ffffff',
    surfaceElevated: '#f5f5f5',
    border: '#e5e5e5',
    text: '#171717',
    textSecondary: '#525252',
    textMuted: '#737373',
    primary: '#171717',
    primaryGlow: 'rgba(0, 0, 0, 0.15)',
    real: '#16a34a',
    realGlow: 'rgba(22, 163, 74, 0.25)',
    ai: '#dc2626',
    aiGlow: 'rgba(220, 38, 38, 0.25)',
    correct: '#16a34a',
    wrong: '#dc2626',
    streak: '#ca8a04',
    streakGlow: 'rgba(202, 138, 4, 0.25)',
    white: '#ffffff',
    black: '#000000',
  },
};

let currentThemeId: ThemeId = 'dark';

export function getCurrentTheme(): ThemeId {
  return currentThemeId;
}

export function setTheme(id: ThemeId): void {
  currentThemeId = id;
}

export function getThemeColors(): ThemeColors {
  return THEMES[currentThemeId];
}
