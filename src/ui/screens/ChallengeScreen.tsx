import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getChallengeContents, getChallengeShareUrl } from '../../challenge/challenge';
import type { GameContent } from '../../logic/types';
import { GameAnswerButton } from '../GameAnswerButton';
import { Button } from '../Button';
import { colors, spacing, typography } from '../theme';
import { Share } from 'react-native';

interface ChallengeScreenProps {
  challengeId: string;
  onBack: () => void;
}

export const ChallengeScreen = React.memo(function ChallengeScreen({ challengeId, onBack }: ChallengeScreenProps) {
  const { t } = useTranslation();
  const [contents, setContents] = useState<GameContent[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const list = getChallengeContents(challengeId);
    setContents(list);
    setIndex(0);
    setScore(0);
    setIsRevealing(false);
    setLastCorrect(null);
  }, [challengeId]);

  const current = contents[index];
  const isDone = contents.length > 0 && index >= contents.length;

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

  const handleShare = async () => {
    const url = getChallengeShareUrl(challengeId);
    const message = t('challenge.shareMessage', { score, total: contents.length, url });
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(`${message}\n${url}`);
        }
        return;
      }
      await Share.share({ message, url });
    } catch {
      // ignore
    }
  };

  if (contents.length === 0 && !current) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>{t('challenge.loading')}</Text>
        <Button title={t('home.backToHome')} onPress={onBack} variant="secondary" style={styles.backBtn} />
      </SafeAreaView>
    );
  }

  if (isDone) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{t('challenge.resultTitle')}</Text>
          <Text style={styles.resultScore}>
            {score}/{contents.length}
          </Text>
          <Text style={styles.resultSub}>{t('challenge.resultSub')}</Text>
          <Button title={t('challenge.shareCta')} onPress={handleShare} variant="primary" style={styles.resultBtn} />
          <Button title={t('home.backToHome')} onPress={onBack} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  if (!current) return null;

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

      <Animated.View entering={FadeIn.duration(280)} style={styles.imageWrapper}>
        {current.contentType === 'image' && current.uri ? (
          <Image
            source={{ uri: current.uri }}
            style={styles.image}
            contentFit="cover"
            cachePolicy={Platform.OS === 'web' ? 'none' : 'memory-disk'}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
        {isRevealing && lastCorrect !== null && (
          <View style={[styles.revealBadge, lastCorrect ? styles.revealCorrect : styles.revealWrong]}>
            <Text style={styles.revealText}>{lastCorrect ? t('result.correct') : t('result.wrong')}</Text>
            <Text style={styles.revealSub}>{t('result.itWas', { answer: current.imageType === 'real' ? t('game.real') : t('game.ai') })}</Text>
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
  backText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  progress: {
    ...typography.caption,
    color: colors.textMuted,
  },
  scoreLabel: {
    ...typography.headline,
    color: colors.text,
  },
  imageWrapper: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  placeholderText: {
    fontSize: 48,
    color: colors.textMuted,
  },
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
  resultTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  resultScore: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  resultSub: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  resultBtn: {
    marginBottom: spacing.md,
  },
});
