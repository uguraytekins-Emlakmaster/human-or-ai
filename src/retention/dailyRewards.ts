/**
 * Daily rewards: coins, extra attempts, themes.
 * AsyncStorage ile kalıcı; claim tarihi ve streak korunur.
 */

import { addCoins } from '../progression/achievements';
import type { ThemeId } from '../logic/types';
import { getItem, setItem, STORAGE_KEYS } from '../storage/persistence';

const REWARD_DAYS = 7;
const COINS_PER_DAY = [10, 15, 20, 25, 30, 50, 100];

type DailyRewardsStore = { lastClaimDate: string; streak: number };

let lastClaimDate = '';
let streak = 0;

function persist(): void {
  setItem(STORAGE_KEYS.DAILY_REWARDS, { lastClaimDate, streak });
}

/** Uygulama açılışında çağrılır. */
export function initFromStorage(data: DailyRewardsStore | null): void {
  if (data && typeof data === 'object') {
    lastClaimDate = data.lastClaimDate ?? '';
    streak = typeof data.streak === 'number' ? data.streak : 0;
  }
}

export async function loadFromStorage(): Promise<void> {
  const data = await getItem<DailyRewardsStore>(STORAGE_KEYS.DAILY_REWARDS);
  initFromStorage(data);
}

export function getDailyRewardState(): {
  day: number;
  canClaim: boolean;
  streak: number;
  nextReward: string;
} {
  const today = new Date().toISOString().slice(0, 10);
  if (lastClaimDate !== today) {
    if (lastClaimDate) {
      const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      if (lastClaimDate === yesterday) streak += 1;
      else streak = 0;
    }
  }
  const day = (streak % REWARD_DAYS) + 1;
  const canClaim = lastClaimDate !== today;
  return {
    day: Math.min(day, REWARD_DAYS),
    canClaim,
    streak,
    nextReward: canClaim ? `${COINS_PER_DAY[day - 1] ?? 50} coins` : 'Tomorrow',
  };
}

export function claimDailyReward(): { coins: number; day: number } | null {
  const today = new Date().toISOString().slice(0, 10);
  if (lastClaimDate === today) return null;
  const { day } = getDailyRewardState();
  const coins = COINS_PER_DAY[day - 1] ?? 50;
  addCoins(coins);
  lastClaimDate = today;
  persist();
  return { coins, day };
}

export function getUnlockableThemes(): { id: ThemeId; cost: number; name: string }[] {
  return [
    { id: 'dark', cost: 0, name: 'Dark' },
    { id: 'neon', cost: 200, name: 'Neon' },
    { id: 'minimal', cost: 150, name: 'Minimal' },
  ];
}
