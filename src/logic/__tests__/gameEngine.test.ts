/**
 * Unit tests for game engine
 */

import {
  getInitialState,
  calculateLevel,
  processAnswer,
  getStreakBonusMessage,
  STREAK_BONUS_EVERY,
  STREAK_BONUS_POINTS,
} from '../gameEngine';
import type { GameConfig, GameContent } from '../types';

const mockContent = (overrides: Partial<GameContent> = {}): GameContent => ({
  contentType: 'image',
  id: 'test-1',
  uri: 'https://example.com/1.jpg',
  imageType: 'real',
  difficultyLevel: 5,
  category: 'portrait',
  ...overrides,
});

describe('getInitialState', () => {
  it('returns correct state for classic mode', () => {
    const state = getInitialState({ mode: 'classic' });
    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.level).toBe(1);
    expect(state.gameMode).toBe('classic');
    expect(state.timeLeft).toBe(0);
    expect(state.isPlaying).toBe(true);
    expect(state.isRevealing).toBe(false);
    expect(state.lastResult).toBeNull();
    expect(state.difficulty).toBe('medium');
    expect(state.powerUps.fiftyFifty).toBe(1);
    expect(state.powerUps.skip).toBe(2);
  });

  it('sets timeLimit for time_attack', () => {
    const state = getInitialState({ mode: 'time_attack', timeLimit: 60 });
    expect(state.timeLeft).toBe(60);
    expect(state.gameMode).toBe('time_attack');
  });
});

describe('calculateLevel', () => {
  it('returns 1 for 0 correct', () => {
    expect(calculateLevel(0, 'classic')).toBe(1);
  });
  it('increases with totalCorrect', () => {
    expect(calculateLevel(3, 'classic')).toBe(2);
    expect(calculateLevel(6, 'classic')).toBe(3);
  });
  it('caps at 20', () => {
    expect(calculateLevel(100, 'classic')).toBe(20);
  });
  it('returns 16 for expert mode', () => {
    expect(calculateLevel(0, 'expert')).toBe(16);
    expect(calculateLevel(50, 'expert')).toBe(16);
  });
});

describe('processAnswer', () => {
  it('correct real guess on real image', () => {
    const state = getInitialState({ mode: 'classic' });
    const content = mockContent({ imageType: 'real' });
    const result = processAnswer({ ...state, streak: 0 }, 'real', content);
    expect(result.correct).toBe(true);
    expect(result.newScore).toBe(1);
    expect(result.newStreak).toBe(1);
    expect(result.streakBonus).toBe(0);
  });

  it('wrong guess resets streak', () => {
    const state = getInitialState({ mode: 'classic' });
    Object.assign(state, { streak: 3 });
    const content = mockContent({ imageType: 'real' });
    const result = processAnswer(state, 'ai', content);
    expect(result.correct).toBe(false);
    expect(result.newStreak).toBe(0);
    expect(result.newScore).toBe(state.score);
  });

  it('streak bonus at every 5', () => {
    const state = getInitialState({ mode: 'classic' });
    Object.assign(state, { score: 0, streak: 4 });
    const content = mockContent({ imageType: 'ai' });
    const result = processAnswer(state, 'ai', content);
    expect(result.correct).toBe(true);
    expect(result.newStreak).toBe(5);
    expect(result.streakBonus).toBe(STREAK_BONUS_POINTS);
    expect(result.newScore).toBe(1 + STREAK_BONUS_POINTS);
  });
});

describe('getStreakBonusMessage', () => {
  it('returns empty for streak < 5', () => {
    expect(getStreakBonusMessage(3)).toBe('');
  });
  it('returns message for streak >= 5', () => {
    const msg = getStreakBonusMessage(5);
    expect(msg).toContain('5');
    expect(msg).toContain(String(STREAK_BONUS_POINTS));
  });
});
