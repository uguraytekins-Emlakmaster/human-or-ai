import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Share, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../game/GameContext';
import { Button } from '../Button';
import { colors, spacing, typography } from '../theme';
import { playGameOver } from '../../audio/sounds';
import { trackShare, trackDailyChallengeComplete } from '../../analytics/analytics';
import {
  getPersonalBest,
  updatePersonalBest,
  getPersonalBestMessage,
  getBestScoreEver,
} from '../../retention/personalBest';
import { getShareMessageWithLink } from '../../social/shareChallenge';
import { SOCIAL_PLATFORMS } from '../../social/shareChallenge';
import { recordGamePlayed, checkAndUnlockAchievements, getProgression } from '../../progression/achievements';
import { recordSession } from '../../retention/dailyStreak';
import { getDailyChallengesCompleted, incrementDailyChallengesCompleted } from '../../retention/dailyChallengesCount';
import {
  showRewardedAd,
  showInterstitialAd,
  removeAdsPurchased,
  isMonetizationLive,
} from '../../monetization/ads';
import { setBonusPowerUps } from '../../monetization/monetizationState';
import { recordGameOverForInterstitial, shouldShowInterstitial } from '../../monetization/monetizationState';
import { REWARDED_BONUS_SKIP } from '../../constants/monetization';

interface GameOverScreenProps {
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOverScreen = React.memo(function GameOverScreen({ onPlayAgain, onHome }: GameOverScreenProps) {
  const { t } = useTranslation();
  const { state, startGame, config } = useGame();
  const { score, streak, gameMode, totalShown } = state;
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [pbMessage, setPbMessage] = useState<{ key: string; params?: Record<string, number> } | null>(null);
  const [previousBest, setPreviousBest] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const isDailyComplete = gameMode === 'daily' && totalShown === 10;
  const title = isDailyComplete ? t('gameOver.dailyComplete') : t('gameOver.title');
  const subtitle = isDailyComplete ? t('gameOver.subtitleCorrect', { score }) : t('gameOver.subtitlePoints');

  useEffect(() => {
    const prev = getPersonalBest(gameMode);
    setPreviousBest(prev);
    const newRecord = updatePersonalBest(gameMode, score);
    setIsNewRecord(newRecord);
    setPbMessage(getPersonalBestMessage(gameMode, score));

    playGameOver();
    recordSession();
    if (isDailyComplete) {
      trackDailyChallengeComplete(score);
      incrementDailyChallengesCompleted();
    }
    recordGamePlayed(state.totalCorrect);
    const prog = getProgression();
    const bestScoreEver = Math.max(score, getBestScoreEver());
    const unlocked = checkAndUnlockAchievements({
      totalCorrectLifetime: prog.totalCorrect,
      bestStreak: streak,
      bestScore: bestScoreEver,
      dailyChallengesCompleted: getDailyChallengesCompleted(),
      expertCompleted: gameMode === 'expert' || gameMode === 'ai_trick',
    });
    if (unlocked.length > 0 && __DEV__) {
      console.log('Achievements unlocked:', unlocked.map((a) => a.name));
    }
    recordGameOverForInterstitial();
    if (isMonetizationLive() && shouldShowInterstitial() && !removeAdsPurchased()) {
      showInterstitialAd();
    }
  }, []);

  const handleWatchAdForSkip = async () => {
    if (rewardClaimed) return;
    const ok = await showRewardedAd();
    if (ok) {
      setBonusPowerUps(REWARDED_BONUS_SKIP);
      setRewardClaimed(true);
    }
  };

  const shareMessage = getShareMessageWithLink(score, t);

  const handleShare = async () => {
    try {
      const message = shareMessage;
      const shareTitle = t('common.shareTitle');
      if (Platform.OS !== 'web') {
        const result = await Share.share({
          message,
          title: shareTitle,
        });
        if (result.action === 'sharedAction') {
          trackShare(result.activityType ?? 'unknown', score);
        }
      } else {
        if (navigator.share) {
          await navigator.share({
            title: shareTitle,
            text: message,
          });
          trackShare('web', score);
        } else {
          await navigator.clipboard.writeText(message);
          Alert.alert(t('common.copied'), t('common.copiedMessage'));
        }
      }
    } catch (e) {
      if (__DEV__) console.warn('Share failed', e);
    }
  };

  const handlePlayAgain = () => {
    if (config) {
      startGame(config);
      onPlayAgain();
    } else {
      onHome();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {streak > 0 && (
          <Text style={styles.streak}>{t('gameOver.bestStreak', { count: streak })}</Text>
        )}
        {pbMessage && (
          <Text style={[styles.pb, isNewRecord && styles.pbNew]}>{t(pbMessage.key, pbMessage.params)}</Text>
        )}

        <Text style={styles.hook}>
          {previousBest > 0 && score < previousBest ? t('gameOver.hookBeatBest') : t('gameOver.hookOneMore')}
        </Text>

        <View style={styles.shareCard} collapsable={false}>
          <Text style={styles.shareCardTitle}>{t('common.shareTitle')}</Text>
          <Text style={styles.shareCardScore}>{score}</Text>
          <Text style={styles.shareCardSub}>{t('gameOver.subtitlePoints')}</Text>
        </View>

        <Text style={styles.sharePrompt}>{t('gameOver.challengeFriends')}</Text>
        <Button
          title={t('gameOver.shareScore')}
          onPress={handleShare}
          variant="primary"
          style={styles.shareButton}
        />
        {isMonetizationLive() && !removeAdsPurchased() && !rewardClaimed && (
          <Button
            title={t('gameOver.watchAdForSkip')}
            onPress={handleWatchAdForSkip}
            variant="ghost"
            style={styles.rewardedButton}
          />
        )}
        {rewardClaimed && (
          <Text style={styles.rewardedThanks}>{t('gameOver.thanksBonusSkip')}</Text>
        )}
        <View style={styles.socialRow}>
          {SOCIAL_PLATFORMS.map((p) => (
            <Button
              key={p.id}
              title={p.icon}
              onPress={handleShare}
              variant="secondary"
              style={styles.socialButton}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <Button title={t('gameOver.playAgain')} onPress={handlePlayAgain} large />
          <View style={styles.spacer} />
          <Button title={t('gameOver.home')} onPress={onHome} variant="secondary" />
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.titleLarge,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  score: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  streak: {
    ...typography.bodySmall,
    color: colors.streak,
    marginBottom: spacing.md,
  },
  pb: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  pbNew: {
    color: colors.streak,
    fontWeight: '600',
  },
  hook: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  shareCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 220,
  },
  shareCardTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  shareCardScore: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  shareCardSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sharePrompt: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.md,
  },
  shareButton: {
    marginBottom: spacing.sm,
    minWidth: 200,
  },
  rewardedButton: {
    marginBottom: spacing.sm,
  },
  rewardedThanks: {
    ...typography.caption,
    color: colors.correct,
    marginBottom: spacing.sm,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  socialButton: {
    minWidth: 48,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
  },
  spacer: { height: spacing.md },
});
