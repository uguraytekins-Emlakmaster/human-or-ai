/**
 * Leaderboard service – single entry point.
 * Currently uses local storage (leaderboard.ts). Replace with remote (Firebase/Supabase) by
 * implementing the same interface and swapping this file's exports.
 */

export {
  getLeaderboard,
  submitScore,
  getPlayerBest,
  resetPeriodIfNewDay,
  setLeaderboardStore,
} from './leaderboard';
