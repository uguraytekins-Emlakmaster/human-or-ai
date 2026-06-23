import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect, useMemo } from 'react';
import type { GameState, GameConfig, GameContent, LastResult } from '../logic/types';
import { getInitialState, calculateLevel, processAnswer } from '../logic/gameEngine';
import { buildDataset } from '../images/dataset';
import { buildAudioContent } from '../content/audioDataset';
import { buildTextContent } from '../content/textDataset';
import { buildVideoContent } from '../content/videoDataset';
import { selectNextContent } from '../content/selectContent';
import { trackGameStart, trackGameOver } from '../analytics/analytics';
import { RECENT_IDS_MAX } from '../constants/gameConstants';
import { getBonusPowerUps, clearBonusPowerUps } from '../monetization/monetizationState';

type GameAction =
  | { type: 'START'; config: GameConfig; bonusPowerUps?: { skip: number } }
  | { type: 'SET_IMAGE'; image: GameContent | null }
  | { type: 'ANSWER'; choice: 'real' | 'ai' }
  | { type: 'NEXT' }
  | { type: 'REVEAL_DONE' }
  | { type: 'GAME_OVER' }
  | { type: 'TICK_TIME' }
  | { type: 'USE_FIFTY_FIFTY' }
  | { type: 'SKIP' };

interface GameContextValue {
  state: GameState;
  config: GameConfig | null;
  result: LastResult | null;
  startGame: (config: GameConfig) => void;
  submitAnswer: (choice: 'real' | 'ai') => void;
  nextImage: () => void;
  finishReveal: () => void;
  getShareMessage: () => string;
  useFiftyFifty: () => void;
  useSkip: () => void;
}

const imagePool = buildDataset();
const audioPool = buildAudioContent();
const textPool = buildTextContent();
const videoPool = buildVideoContent();
const recentIds = { current: [] as string[] };

function pushRecentAndCap(ids: string[], id: string, cap: number): string[] {
  const next = [...ids, id];
  return next.length > cap ? next.slice(-cap) : next;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START': {
      recentIds.current = [];
      return getInitialState(action.config, action.bonusPowerUps);
    }
    case 'SET_IMAGE':
      return { ...state, currentImage: action.image, hiddenAnswer: null };
    case 'ANSWER': {
      if (!state.currentImage || state.isRevealing) return state;
      const { correct, newScore, newStreak, streakBonus } = processAnswer(
        state,
        action.choice,
        state.currentImage
      );
      recentIds.current = pushRecentAndCap(recentIds.current, state.currentImage.id, RECENT_IDS_MAX);
      const totalShown = state.totalShown + 1;
      const totalCorrect = state.totalCorrect + (correct ? 1 : 0);
      const dailyLimit = 10;
      const dailyComplete = state.gameMode === 'daily' && correct && totalShown >= dailyLimit;
      return {
        ...state,
        score: newScore,
        streak: newStreak,
        totalCorrect,
        totalShown,
        isRevealing: true,
        isPlaying: correct && !dailyComplete,
        lastResult: {
          correct,
          streakBonus,
          previousStreak: correct ? undefined : state.streak,
        },
      };
    }
    case 'REVEAL_DONE':
      return { ...state, isRevealing: false, lastResult: null };
    case 'NEXT': {
      const nextLevel = calculateLevel(state.totalCorrect, state.gameMode);
      const next = selectNextContent(
        imagePool,
        audioPool,
        textPool,
        videoPool,
        { ...state, level: nextLevel },
        recentIds.current,
        {
          mode: state.gameMode,
          expertMode: state.gameMode === 'expert' || state.gameMode === 'ai_trick',
          category: state.category,
          difficulty: state.difficulty,
          contentTypes: state.contentTypes,
        }
      );
      return {
        ...state,
        level: nextLevel,
        currentImage: next,
        lastResult: null,
      };
    }
    case 'USE_FIFTY_FIFTY': {
      if (!state.currentImage || state.powerUps.fiftyFifty <= 0 || state.hiddenAnswer !== null) return state;
      const wrong: 'real' | 'ai' = state.currentImage.imageType === 'real' ? 'ai' : 'real';
      return {
        ...state,
        powerUps: { ...state.powerUps, fiftyFifty: state.powerUps.fiftyFifty - 1 },
        hiddenAnswer: wrong,
      };
    }
    case 'SKIP':
      return { ...state, powerUps: { ...state.powerUps, skip: Math.max(0, state.powerUps.skip - 1) } };
    case 'GAME_OVER':
      return { ...state, isPlaying: false };
    case 'TICK_TIME': {
      if (state.gameMode !== 'time_attack') return state;
      const next = Math.max(0, state.timeLeft - 1);
      return { ...state, timeLeft: next, isPlaying: next > 0 ? state.isPlaying : false };
    }
    default:
      return state;
  }
}

const GameContext = createContext<GameContextValue | null>(null);

const initialGameState: GameState = {
  score: 0,
  streak: 0,
  level: 1,
  currentImage: null,
  gameMode: 'classic',
  timeLeft: 0,
  isPlaying: false,
  isRevealing: false,
  totalCorrect: 0,
  totalShown: 0,
  lastResult: null,
  category: 'all',
  difficulty: 'medium',
  powerUps: { fiftyFifty: 1, skip: 2 },
  hiddenAnswer: null,
  contentTypes: ['image', 'audio', 'text', 'video'],
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const startGame = useCallback((config: GameConfig) => {
    trackGameStart(config.mode);
    const bonus = getBonusPowerUps();
    dispatch({ type: 'START', config, bonusPowerUps: bonus.skip > 0 ? bonus : undefined });
    clearBonusPowerUps();
    const initialState = getInitialState(config, bonus.skip > 0 ? bonus : undefined);
    const fullConfig = { ...config, category: config.category ?? 'all', difficulty: config.difficulty ?? 'medium', contentTypes: config.contentTypes ?? ['image', 'audio', 'text', 'video'] };
    let next = selectNextContent(
      imagePool,
      audioPool,
      textPool,
      videoPool,
      initialState,
      [],
      fullConfig
    );
    if (next === null && fullConfig.contentTypes && fullConfig.contentTypes.length > 1) {
      next = selectNextContent(imagePool, audioPool, textPool, videoPool, initialState, [], { ...fullConfig, contentTypes: ['image'] });
    }
    dispatch({ type: 'SET_IMAGE', image: next });
    if (next === null) dispatch({ type: 'GAME_OVER' });
  }, []);

  const submitAnswer = useCallback((choice: 'real' | 'ai') => {
    const s = stateRef.current;
    if (!s.currentImage || s.isRevealing) return;
    const { correct } = processAnswer(s, choice, s.currentImage);
    dispatch({ type: 'ANSWER', choice });
    if (!correct) {
      dispatch({ type: 'GAME_OVER' });
      trackGameOver(s.score, s.streak, s.gameMode);
    }
  }, []);

  const nextImage = useCallback(() => {
    const s = stateRef.current;
    dispatch({ type: 'REVEAL_DONE' });
    if (!s.isPlaying) return;
    const nextLevel = calculateLevel(s.totalCorrect, s.gameMode);
    const next = selectNextContent(
      imagePool,
      audioPool,
      textPool,
      videoPool,
      { ...s, level: nextLevel },
      recentIds.current,
      { mode: s.gameMode, expertMode: s.gameMode === 'expert' || s.gameMode === 'ai_trick', category: s.category, difficulty: s.difficulty, contentTypes: s.contentTypes }
    );
    if (next === null) {
      dispatch({ type: 'GAME_OVER' });
      dispatch({ type: 'SET_IMAGE', image: null });
    } else {
      dispatch({ type: 'SET_IMAGE', image: next });
    }
  }, []);

  const useFiftyFifty = useCallback(() => {
    const s = stateRef.current;
    if (!s.currentImage || s.powerUps.fiftyFifty <= 0 || s.hiddenAnswer !== null) return;
    dispatch({ type: 'USE_FIFTY_FIFTY' });
  }, []);

  const useSkip = useCallback(() => {
    const s = stateRef.current;
    if (!s.currentImage || s.isRevealing || s.powerUps.skip <= 0) return;
    recentIds.current = pushRecentAndCap(recentIds.current, s.currentImage.id, RECENT_IDS_MAX);
    dispatch({ type: 'SKIP' });
    const nextLevel = calculateLevel(s.totalCorrect, s.gameMode);
    const next = selectNextContent(
      imagePool,
      audioPool,
      textPool,
      videoPool,
      { ...s, level: nextLevel },
      recentIds.current,
      { mode: s.gameMode, expertMode: s.gameMode === 'expert' || s.gameMode === 'ai_trick', category: s.category, difficulty: s.difficulty, contentTypes: s.contentTypes }
    );
    if (next === null) {
      dispatch({ type: 'GAME_OVER' });
      dispatch({ type: 'SET_IMAGE', image: null });
    } else {
      dispatch({ type: 'SET_IMAGE', image: next });
    }
  }, []);

  const finishReveal = useCallback(() => {
    dispatch({ type: 'REVEAL_DONE' });
  }, []);

  const getShareMessage = useCallback(() => {
    return `I scored ${stateRef.current.score} in HUMAN OR AI. Can you beat me?`;
  }, []);

  // Time Attack: countdown every second
  useEffect(() => {
    if (state.gameMode !== 'time_attack' || !state.isPlaying || state.timeLeft <= 0) return;
    const id = setInterval(() => dispatch({ type: 'TICK_TIME' }), 1000);
    return () => clearInterval(id);
  }, [state.gameMode, state.isPlaying, state.timeLeft]);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      config: state.gameMode
        ? {
            mode: state.gameMode,
            category: state.category,
            timeLimit: state.gameMode === 'time_attack' ? 60 : undefined,
            difficulty: state.difficulty,
            contentTypes: state.contentTypes,
          }
        : null,
      result: state.lastResult,
      startGame,
      submitAnswer,
      nextImage,
      finishReveal,
      getShareMessage,
      useFiftyFifty,
      useSkip,
    }),
    [state, startGame, submitAnswer, nextImage, finishReveal, getShareMessage, useFiftyFifty, useSkip]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
