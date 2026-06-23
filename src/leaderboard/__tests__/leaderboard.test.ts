/**
 * Unit tests for leaderboard
 */

import {
  getLeaderboard,
  submitScore,
  getPlayerBest,
} from '../leaderboard';
import type { LeaderboardPeriod } from '../../logic/types';

describe('leaderboard', () => {
  it('getLeaderboard returns array', () => {
    const daily = getLeaderboard('daily');
    expect(Array.isArray(daily)).toBe(true);
  });

  it('submitScore adds entry and getLeaderboard returns sorted by score', () => {
    submitScore('all_time', 'Player1', 10);
    submitScore('all_time', 'Player2', 25);
    submitScore('all_time', 'Player3', 15);
    const list = getLeaderboard('all_time');
    expect(list.length).toBeGreaterThanOrEqual(3);
    expect(list[0].score).toBe(25);
    expect(list[0].rank).toBe(1);
  });

  it('getPlayerBest returns highest score for name', () => {
    submitScore('weekly', 'TestUser', 5);
    submitScore('weekly', 'TestUser', 12);
    expect(getPlayerBest('weekly', 'TestUser')).toBe(12);
  });
});
