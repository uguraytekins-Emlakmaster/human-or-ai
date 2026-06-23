import React, { useState, useCallback } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { HomeScreen } from '../ui/screens/HomeScreen';
import { GameScreen } from '../ui/screens/GameScreen';
import { ResultScreen } from '../ui/screens/ResultScreen';
import { GameOverScreen } from '../ui/screens/GameOverScreen';
import { LeaderboardScreen } from '../ui/screens/LeaderboardScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { AchievementsScreen } from '../ui/screens/AchievementsScreen';
import { DailyQuestionScreen } from '../ui/screens/DailyQuestionScreen';
import { ChallengeScreen } from '../ui/screens/ChallengeScreen';
import { VideoTourScreen } from '../ui/screens/VideoTourScreen';
import { PrivacyPolicyScreen } from '../ui/screens/PrivacyPolicyScreen';
import { generateChallengeId, parseChallengeIdFromUrl } from '../challenge/challenge';
import type { GameMode, CategorySlug, DifficultyLevel } from '../logic/types';

export type AppScreen =
  | 'home'
  | 'game'
  | 'result'
  | 'game_over'
  | 'leaderboard'
  | 'settings'
  | 'achievements'
  | 'daily_question'
  | 'challenge'
  | 'video_tour'
  | 'privacy';

function AppNavigatorInner() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const { startGame } = useGame();

  const handleChallengeFriend = useCallback(() => {
    setChallengeId(generateChallengeId());
    setScreen('challenge');
  }, []);

  const handleVideoTour = useCallback(() => setScreen('video_tour'), []);

  const handleChallengeWithCode = useCallback((codeOrUrl: string) => {
    const id = parseChallengeIdFromUrl(codeOrUrl) || (codeOrUrl.trim().length >= 6 ? codeOrUrl.trim().slice(0, 12) : null);
    if (id) {
      setChallengeId(id);
      setScreen('challenge');
    }
  }, []);

  const handlePlay = useCallback((mode: GameMode, category?: CategorySlug, difficulty?: DifficultyLevel) => {
    const timeLimit = mode === 'time_attack' ? 60 : undefined;
    startGame({
      mode,
      timeLimit,
      category,
      difficulty: difficulty ?? 'medium',
      contentTypes: ['image', 'audio', 'text', 'video'],
    });
    setScreen('game');
  }, [startGame]);

  const handleLeaderboard = useCallback(() => setScreen('leaderboard'), []);
  const handleSettings = useCallback(() => setScreen('settings'), []);
  const handleAchievements = useCallback(() => setScreen('achievements'), []);
  const handleDailyQuestion = useCallback(() => setScreen('daily_question'), []);
  const handleBack = useCallback(() => setScreen('home'), []);
  const handleBackToSettings = useCallback(() => setScreen('settings'), []);
  const handlePrivacy = useCallback(() => setScreen('privacy'), []);

  const handleResult = useCallback(() => setScreen('result'), []);
  const handleGameOver = useCallback(() => setScreen('game_over'), []);
  const handleNextFromResult = useCallback(() => setScreen('game'), []);
  const handlePlayAgain = useCallback(() => setScreen('game'), []);
  const handleHomeFromGameOver = useCallback(() => setScreen('home'), []);

  if (screen === 'home') {
    return (
      <HomeScreen
        onPlay={handlePlay}
        onLeaderboard={handleLeaderboard}
        onSettings={handleSettings}
        onDailyQuestion={handleDailyQuestion}
        onChallengeFriend={handleChallengeFriend}
        onChallengeWithCode={handleChallengeWithCode}
        onVideoTour={handleVideoTour}
      />
    );
  }

  if (screen === 'daily_question') {
    return <DailyQuestionScreen onBack={handleBack} />;
  }

  if (screen === 'challenge' && challengeId) {
    return <ChallengeScreen challengeId={challengeId} onBack={handleBack} />;
  }
  if (screen === 'challenge') {
    return (
      <HomeScreen
        onPlay={handlePlay}
        onLeaderboard={handleLeaderboard}
        onSettings={handleSettings}
        onDailyQuestion={handleDailyQuestion}
        onChallengeFriend={handleChallengeFriend}
        onChallengeWithCode={handleChallengeWithCode}
        onVideoTour={handleVideoTour}
      />
    );
  }

  if (screen === 'video_tour') {
    return <VideoTourScreen onBack={handleBack} />;
  }

  if (screen === 'game') {
    return (
      <GameScreen onResult={handleResult} onGameOver={handleGameOver} />
    );
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        onNext={handleNextFromResult}
        onGameOver={handleGameOver}
      />
    );
  }

  if (screen === 'game_over') {
    return (
      <GameOverScreen
        onPlayAgain={handlePlayAgain}
        onHome={handleHomeFromGameOver}
      />
    );
  }

  if (screen === 'leaderboard') {
    return <LeaderboardScreen onBack={handleBack} />;
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        onBack={handleBack}
        onAchievements={handleAchievements}
        onPrivacy={handlePrivacy}
      />
    );
  }

  if (screen === 'privacy') {
    return <PrivacyPolicyScreen onBack={handleBackToSettings} />;
  }

  if (screen === 'achievements') {
    return <AchievementsScreen onBack={handleBackToSettings} />;
  }

  return null;
}

export function AppNavigator() {
  return (
    <GameProvider>
      <AppNavigatorInner />
    </GameProvider>
  );
}
