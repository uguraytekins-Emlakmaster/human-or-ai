/**
 * Core types for Human or AI game
 */

export type ImageType = 'real' | 'ai';

/** Soru içerik türü: resim, ses, metin, video (video ileride premium) */
export type ContentType = 'image' | 'audio' | 'text' | 'video';

export type ImageCategory =
  | 'portrait'
  | 'animal'
  | 'food'
  | 'architecture'
  | 'object'
  | 'landscape'
  | 'nature'
  | 'art'
  | 'fashion'
  | 'street';

export interface GameImage {
  id: string;
  uri: string;
  imageType: ImageType;
  difficultyLevel: number;
  category: ImageCategory;
  source?: 'dataset' | 'generated';
  explanation?: string;
}

/** Tek tip: resim/ses/metin/video – oyun aynı, sadece gösterim farklı */
export interface GameContent {
  contentType: ContentType;
  id: string;
  imageType: ImageType;
  difficultyLevel: number;
  category: ImageCategory;
  explanation?: string;
  uri?: string;
  audioUri?: string;
  text?: string;
  videoUri?: string;
}

/** Zorluk: kolay/orta/zor – mevcut level sistemine bağlı */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/** Power-up: tur başına kullanım hakkı */
export interface PowerUpState {
  fiftyFifty: number;
  skip: number;
}

export type GameMode = 'classic' | 'time_attack' | 'daily' | 'expert' | 'ai_trick';

/** Play by single category (Faces, Food, Nature, etc.) */
export type CategorySlug = 'faces' | 'food' | 'nature' | 'architecture' | 'animals' | 'all';

export interface LastResult {
  correct: boolean;
  streakBonus: number;
  /** Yanlış cevapta önceki streak (bağımlılık: "X streak kaybettin") */
  previousStreak?: number;
}

export interface GameState {
  score: number;
  streak: number;
  level: number;
  /** Mevcut soru (resim/ses/metin/video); geriye uyum için currentImage alias */
  currentImage: GameContent | null;
  gameMode: GameMode;
  timeLeft: number;
  isPlaying: boolean;
  isRevealing: boolean;
  totalCorrect: number;
  totalShown: number;
  lastResult: LastResult | null;
  category: CategorySlug;
  /** Zorluk seçimi */
  difficulty: DifficultyLevel;
  /** Kalan power-up kullanımları */
  powerUps: PowerUpState;
  /** 50/50 ile bu turda gizlenen cevap */
  hiddenAnswer: 'real' | 'ai' | null;
  /** Oyunda dönecek içerik türleri */
  contentTypes: ContentType[];
}

export interface GameConfig {
  mode: GameMode;
  timeLimit?: number;
  dailyImageIds?: string[];
  expertMode?: boolean;
  category?: CategorySlug;
  difficulty?: DifficultyLevel;
  /** Hangi içerik türleri kullanılsın (varsayılan: image, audio, text) */
  contentTypes?: ContentType[];
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'all_time';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  period: LeaderboardPeriod;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

/** Achievement definition + unlock state */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: number;
}

/** Cosmetic theme id */
export type ThemeId = 'dark' | 'neon' | 'minimal';

/** Player progression (XP, level, coins) */
export interface PlayerProgression {
  xp: number;
  level: number;
  coins: number;
  totalCorrect: number;
  gamesPlayed: number;
}
