import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { getQuestionOfTheDay } from '../../content/questionOfTheDay';
import { getExplanationForImage } from '../../ai/imageExplanations';
import type { GameContent } from '../../logic/types';
import { Button } from '../Button';
import { GameAnswerButton } from '../GameAnswerButton';
import { colors, spacing, typography } from '../theme';

interface DailyQuestionScreenProps {
  onBack: () => void;
}

export const DailyQuestionScreen = React.memo(function DailyQuestionScreen({ onBack }: DailyQuestionScreenProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState<GameContent | null>(null);
  const [answered, setAnswered] = useState(false);
  const [userChoice, setUserChoice] = useState<'real' | 'ai' | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setContent(getQuestionOfTheDay());
  }, []);

  if (content === null) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Text style={styles.loading}>{t('common.loading')}</Text>
          <Button title={t('home.backToHome')} onPress={onBack} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  const correct = userChoice !== null && userChoice === content.imageType;
  const answerLabel = content.imageType === 'real' ? t('game.real') : t('game.ai');
  const explanation = getExplanationForImage(content);

  const handleAnswer = (choice: 'real' | 'ai') => {
    if (answered) return;
    setUserChoice(choice);
    setAnswered(true);
  };

  const handleShare = async () => {
    try {
      const message = t('dailyQuestion.shareMessage', { answer: answerLabel });
      const title = t('dailyQuestion.shareTitle');
      if (Platform.OS !== 'web') {
        await Share.share({ message, title });
      } else {
        if (navigator.share) {
          await navigator.share({ title, text: message });
        } else {
          await navigator.clipboard.writeText(message);
          Alert.alert(t('common.copied'), t('common.copiedMessage'));
        }
      }
    } catch (e) {
      if (__DEV__) console.warn('Share failed', e);
    }
  };

  if (!answered) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← {t('settings.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dailyQuestion.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.contentWrap}>
          {content.contentType === 'image' && content.uri ? (
            imageError ? (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>{t('game.imageUnavailable')}</Text>
              </View>
            ) : (
              <Image
                source={{ uri: content.uri }}
                style={styles.image}
                contentFit="cover"
                onError={() => setImageError(true)}
              />
            )
          ) : null}
        </View>
        <View style={styles.buttons}>
          <View style={styles.buttonFlex}>
            <GameAnswerButton type="real" onPress={() => handleAnswer('real')} />
          </View>
          <View style={styles.buttonFlex}>
            <GameAnswerButton type="ai" onPress={() => handleAnswer('ai')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.resultCard}>
        <Text style={[styles.resultText, correct ? styles.correct : styles.wrong]}>
          {correct ? t('result.correct') : t('result.wrong')}
        </Text>
        <Text style={styles.answerText}>{t('result.itWas', { answer: answerLabel })}</Text>
        {explanation ? (
          <>
            <Text style={styles.whyLabel}>{t('result.why')}</Text>
            <Text style={styles.explanation}>{explanation}</Text>
          </>
        ) : null}
        <Button
          title={t('dailyQuestion.shareCta')}
          onPress={handleShare}
          variant="primary"
          style={styles.shareBtn}
        />
        <Button title={t('dailyQuestion.backToHome')} onPress={onBack} variant="secondary" />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: spacing.sm },
  backText: { ...typography.body, color: colors.primary },
  title: { ...typography.headline, color: colors.text, flex: 1, textAlign: 'center' },
  headerSpacer: { width: 60 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  contentWrap: {
    flex: 1,
    margin: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  placeholderText: { ...typography.bodySmall, color: colors.textMuted },
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
  resultText: { ...typography.titleLarge, marginBottom: spacing.sm },
  correct: { color: colors.correct },
  wrong: { color: colors.wrong },
  answerText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  whyLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xs },
  explanation: { ...typography.caption, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.md },
  shareBtn: { marginTop: spacing.lg, marginBottom: spacing.sm, minWidth: 200 },
});
