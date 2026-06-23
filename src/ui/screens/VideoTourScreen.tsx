import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getVideoTourContents } from '../../content/videoDataset';
import type { GameContent } from '../../logic/types';
import { GameAnswerButton } from '../GameAnswerButton';
import { Button } from '../Button';
import { colors, spacing, typography } from '../theme';

interface VideoTourScreenProps {
  onBack: () => void;
}

export const VideoTourScreen = React.memo(function VideoTourScreen({ onBack }: VideoTourScreenProps) {
  const { t } = useTranslation();
  const [contents, setContents] = useState<GameContent[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setContents(getVideoTourContents());
    setIndex(0);
    setScore(0);
    setIsRevealing(false);
    setLastCorrect(null);
    setVideoError(false);
  }, []);

  const current = contents[index];
  const isDone = contents.length > 0 && index >= contents.length;

  useEffect(() => {
    if (current) setVideoError(false);
  }, [current?.id]);

  const handleAnswer = (answer: 'real' | 'ai') => {
    if (!current || isRevealing) return;
    const correct = current.imageType === answer;
    setLastCorrect(correct);
    setIsRevealing(true);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setIsRevealing(false);
      setLastCorrect(null);
      setIndex((i) => i + 1);
    }, 1200);
  };

  if (contents.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>{t('game.loading')}</Text>
        <Button title={t('home.backToHome')} onPress={onBack} variant="secondary" style={styles.backBtn} />
      </SafeAreaView>
    );
  }

  if (isDone) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{t('videoTour.resultTitle')}</Text>
          <Text style={styles.resultScore}>
            {score}/{contents.length}
          </Text>
          <Text style={styles.resultSub}>{t('videoTour.resultSub')}</Text>
          <Button title={t('home.backToHome')} onPress={onBack} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  if (!current?.videoUri) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← {t('home.backToHome')}</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          {index + 1}/{contents.length}
        </Text>
        <Text style={styles.scoreLabel}>{score}</Text>
      </View>

      <Animated.View entering={FadeIn.duration(280)} style={styles.videoWrapper}>
        {videoError ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{t('game.contentUnavailable')}</Text>
          </View>
        ) : (
          <Video
            key={current.id}
            source={{ uri: current.videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            status={{ shouldPlay: true, isLooping: false }}
            onError={() => setVideoError(true)}
          />
        )}
        {isRevealing && lastCorrect !== null && (
          <View style={[styles.revealBadge, lastCorrect ? styles.revealCorrect : styles.revealWrong]}>
            <Text style={styles.revealText}>{lastCorrect ? t('result.correct') : t('result.wrong')}</Text>
            <Text style={styles.revealSub}>
              {t('result.itWas', { answer: current.imageType === 'real' ? t('game.real') : t('game.ai') })}
            </Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.buttons}>
        <View style={styles.buttonFlex}>
          <GameAnswerButton type="real" onPress={() => handleAnswer('real')} disabled={isRevealing} />
        </View>
        <View style={styles.buttonFlex}>
          <GameAnswerButton type="ai" onPress={() => handleAnswer('ai')} disabled={isRevealing} />
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
  loading: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  backBtn: { marginTop: spacing.lg },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backText: { ...typography.bodySmall, color: colors.primary },
  progress: { ...typography.caption, color: colors.textMuted },
  scoreLabel: { ...typography.headline, color: colors.text },
  videoWrapper: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  placeholderText: { ...typography.body, color: colors.textMuted },
  revealBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  revealCorrect: { backgroundColor: colors.correct },
  revealWrong: { backgroundColor: colors.wrong },
  revealText: { ...typography.headline, color: colors.white },
  revealSub: { ...typography.caption, color: colors.white, marginTop: spacing.xs },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  buttonFlex: { flex: 1 },
  resultCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  resultTitle: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
  resultScore: { fontSize: 56, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  resultSub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
});
