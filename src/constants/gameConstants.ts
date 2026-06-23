/**
 * Oyun sabitleri – tek kaynak, yeniden render'da yeniden oluşturulmaz.
 * Performans: referans eşitliği ve bundle boyutu için merkezi sabitler.
 */

import type { GameMode, CategorySlug, LeaderboardPeriod, DifficultyLevel } from '../logic/types';

/** Oyun modları – HomeScreen'de kullanılır */
export const MODES: readonly { id: GameMode; title: string; subtitle: string }[] = [
  { id: 'classic', title: 'Classic', subtitle: 'Endless until you miss' },
  { id: 'time_attack', title: 'Time Attack', subtitle: '60 seconds • max score' },
  { id: 'daily', title: 'Daily Challenge', subtitle: '10 images • global rank' },
  { id: 'expert', title: 'Expert', subtitle: 'Extremely hard AI images' },
  { id: 'ai_trick', title: 'AI Trick', subtitle: 'Ultra-convincing AI only' },
] as const;

/** Kategori modları – "Play by category" */
export const CATEGORIES: readonly { id: CategorySlug; title: string }[] = [
  { id: 'faces', title: 'Faces' },
  { id: 'food', title: 'Food' },
  { id: 'nature', title: 'Nature' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'animals', title: 'Animals' },
] as const;

/** Liderlik tablosu periyotları */
export const LEADERBOARD_PERIODS: readonly { key: LeaderboardPeriod; label: string }[] = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This Week' },
  { key: 'all_time', label: 'All Time' },
] as const;

/** Aynı oturumda tekrar gösterilmemesi için tutulan son görsel ID sayısı. Büyük = daha az tekrar, cap = bellek sızıntısı önleme */
export const RECENT_IDS_MAX = 50;

/** Dataset sürümü – cache invalidation için; artırıldığında yeni URI'lar üretilir */
export const DATASET_VERSION = 1;

/** Zorluk seçimi – kolay/orta/zor; level aralığı */
export const DIFFICULTY_OPTIONS: readonly { id: DifficultyLevel; titleKey: string; levelMin: number; levelMax: number }[] = [
  { id: 'easy', titleKey: 'difficulty.easy', levelMin: 1, levelMax: 6 },
  { id: 'medium', titleKey: 'difficulty.medium', levelMin: 1, levelMax: 15 },
  { id: 'hard', titleKey: 'difficulty.hard', levelMin: 8, levelMax: 20 },
] as const;

/** Power-up: oyun başına kullanım (50/50, atla) */
export const POWER_UP_DEFAULTS = { fiftyFifty: 1, skip: 2 } as const;
