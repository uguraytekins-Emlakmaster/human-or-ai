import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { useGame } from '../../game/GameContext';
import { Button } from '../Button';
import { colors, spacing, typography, animation } from '../theme';
import { playCorrect, playWrong, playStreakBonus } from '../../audio/sounds';
import { getExplanationForImage } from '../../ai/imageExplanations';
import { trackStreakMilestone } from '../../analytics/analytics';

interface ResultScreenProps {
  onNext: () => void;
  onGameOver: () => void;
}

export const ResultScreen = React.memo(function ResultScreen({ onNext, onGameOver }: ResultScreenProps) {
  const { t } = useTranslation();
  const { state, result, nextImage } = useGame();
  const isGameOver = !state.isPlaying;
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const correct = result?.correct ?? false;
  const streakBonus = result?.streakBonus ?? 0;
  const previousStreak = result?.previousStreak ?? 0;
  const answer = state.currentImage?.imageType === 'real' ? t('game.real') : t('game.ai');
  const showSoClose = !correct && previousStreak >= 3;
  const showStreakCelebration = correct && state.streak >= 3 && state.streak <= 25;
  const explanation = state.currentImage ? getExplanationForImage(state.currentImage) : null;
  const pointsThisRound = correct ? 1 + streakBonus : 0;
  const isMilestone5 = correct && state.streak === 5;
  const isMilestone10 = correct && state.streak === 10;
  const isMilestone20 = correct && state.streak === 20;
  const isMilestone25 = correct && state.streak === 25;

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.05, { damping: 12 }),
      withSpring(1)
    );
    opacity.value = withTiming(1, { duration: animation.normal });
    if (correct) {
      playCorrect();
      if (streakBonus > 0) playStreakBonus();
      if ([5, 10, 20, 25].includes(state.streak)) trackStreakMilestone(state.streak);
    } else {
      playWrong();
    }
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleNext = () => {
    if (isGameOver) {
      onGameOver();
      return;
    }
    nextImage();
    onNext();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={[styles.resultText, correct ? styles.correct : styles.wrong]}>
          {correct ? t('result.correct') : t('result.wrong')}
        </Text>
        {showSoClose && (
          <Text style={styles.soClose}>{t('result.soClose', { count: previousStreak })}</Text>
        )}
        <Text style={styles.answer}>{t('result.itWas', { answer })}</Text>
        {pointsThisRound > 0 && (
          <Animated.Text entering={FadeIn.delay(120).duration(200)} style={styles.scoreDelta}>
            +{pointsThisRound}
          </Animated.Text>
        )}
        {streakBonus > 0 && (
          <Text style={styles.bonus}>{t('result.streakBonus', { count: streakBonus })}</Text>
        )}
        {showStreakCelebration && !streakBonus && (
          <Text style={styles.streakCelebration}>{t('result.inARow', { count: state.streak })}</Text>
        )}
        {isMilestone5 && <Text style={styles.milestone}>{t('result.milestone5')}</Text>}
        {isMilestone10 && <Text style={styles.milestone}>{t('result.milestone10')}</Text>}
        {isMilestone20 && <Text style={styles.milestone}>{t('result.milestone20')}</Text>}
        {isMilestone25 && <Text style={styles.milestone}>{t('result.milestone25')}</Text>}
        {explanation && (
          <>
            <Text style={styles.whyLabel}>{t('result.why')}</Text>
            <Text style={styles.explanation}>{explanation}</Text>
          </>
        )}
      </Animated.View>
      <View style={styles.footer}>
        <Button
          title={isGameOver ? t('result.viewResults') : t('result.next')}
          onPress={handleNext}
          large
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.xl,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultText: {
    ...typography.titleLarge,
    marginBottom: spacing.sm,
  },
  correct: { color: colors.correct },
  wrong: { color: colors.wrong },
  answer: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bonus: {
    ...typography.bodySmall,
    color: colors.streak,
  },
  soClose: {
    ...typography.bodySmall,
    color: colors.streak,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  streakCelebration: {
    ...typography.bodySmall,
    color: colors.correct,
    marginTop: spacing.xs,
  },
  scoreDelta: {
    ...typography.headline,
    color: colors.correct,
    marginVertical: spacing.xs,
  },
  whyLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  milestone: {
    ...typography.bodySmall,
    color: colors.streak,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  explanation: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing.sm,
  },
  footer: {
    width: '100%',
    maxWidth: 320,
  },
});
