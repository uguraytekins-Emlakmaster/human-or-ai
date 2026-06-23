/**
 * Core game engine: score, streak, level, difficulty, game over.
 */

import type { GameState, GameConfig, GameMode } from './types';
import type { GameContent } from './types';
import { POWER_UP_DEFAULTS } from '../constants/gameConstants';

const STREAK_BONUS_EVERY = 5;
const STREAK_BONUS_POINTS = 2;

/** Bonus: reklam izleyince sonraki oyuna eklenecek ek güç (sadece skip desteklenir). */
export function getInitialState(
  config: GameConfig,
  bonusPowerUps?: { skip?: number }
): GameState {
  const base = { ...POWER_UP_DEFAULTS };
  const skipBonus = bonusPowerUps?.skip ?? 0;
  return {
    score: 0,
    streak: 0,
    level: 1,
    currentImage: null,
    gameMode: config.mode,
    timeLeft: config.timeLimit ?? 0,
    isPlaying: true,
    isRevealing: false,
    totalCorrect: 0,
    totalShown: 0,
    lastResult: null,
    category: config.category ?? 'all',
    difficulty: config.difficulty ?? 'medium',
    powerUps: {
      ...base,
      skip: base.skip + (skipBonus > 0 ? skipBonus : 0),
    },
    hiddenAnswer: null,
    contentTypes: config.contentTypes ?? ['image', 'audio', 'text', 'video'],
  };
}

export function calculateLevel(totalCorrect: number, mode: GameMode): number {
  if (mode === 'expert' || mode === 'ai_trick') return 16;
  return Math.min(20, Math.floor(totalCorrect / 3) + 1);
}

export function processAnswer(
  state: GameState,
  userChoice: 'real' | 'ai',
  content: GameContent
): { correct: boolean; newScore: number; newStreak: number; streakBonus: number } {
  const correct = userChoice === content.imageType;
  let newScore = state.score;
  let newStreak = correct ? state.streak + 1 : 0;
  let streakBonus = 0;

  if (correct) {
    newScore += 1;
    if (newStreak > 0 && newStreak % STREAK_BONUS_EVERY === 0) {
      streakBonus = STREAK_BONUS_POINTS;
      newScore += streakBonus;
    }
  }

  return { correct, newScore, newStreak, streakBonus };
}

export function getStreakBonusMessage(streak: number): string {
  if (streak < STREAK_BONUS_EVERY) return '';
  return `${streak} streak! +${STREAK_BONUS_POINTS} bonus`;
}

export { STREAK_BONUS_EVERY, STREAK_BONUS_POINTS };
