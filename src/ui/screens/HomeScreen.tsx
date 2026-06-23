import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { colors, spacing, typography } from '../theme';
import type { GameMode, DifficultyLevel } from '../../logic/types';
import type { CategorySlug } from '../../logic/types';
import { getProgression } from '../../progression/achievements';
import { getDailyStreak } from '../../retention/dailyStreak';
import { scheduleStreakReminderIfEnabled } from '../../notifications/streakReminder';
import { MODES, CATEGORIES, DIFFICULTY_OPTIONS } from '../../constants/gameConstants';
import { WeeklyCalendar } from '../WeeklyCalendar';

interface HomeScreenProps {
  onPlay: (mode: GameMode, category?: CategorySlug, difficulty?: DifficultyLevel) => void;
  onLeaderboard: () => void;
  onSettings: () => void;
  onDailyQuestion?: () => void;
  onChallengeFriend?: () => void;
  onChallengeWithCode?: (code: string) => void;
  onVideoTour?: () => void;
}

export const HomeScreen = React.memo(function HomeScreen({
  onPlay,
  onLeaderboard,
  onSettings,
  onDailyQuestion,
  onChallengeFriend,
  onChallengeWithCode,
  onVideoTour,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const progression = getProgression();
  const dailyStreak = getDailyStreak();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [challengeCode, setChallengeCode] = useState('');

  React.useEffect(() => {
    scheduleStreakReminderIfEnabled(dailyStreak);
  }, [dailyStreak]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.title')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
          <View style={styles.xpRow}>
            <Text style={styles.xpText}>{t('home.level', { level: progression.level })}</Text>
            <Text style={styles.xpText}> • </Text>
            <Text style={styles.xpText}>{t('home.coins', { count: progression.coins })}</Text>
            {dailyStreak > 0 && (
              <>
                <Text style={styles.xpText}> • </Text>
                <Text style={styles.streakText}>{t('home.dailyStreak', { count: dailyStreak })}</Text>
              </>
            )}
          </View>
        </View>

        <WeeklyCalendar />

        {onDailyQuestion ? (
          <TouchableOpacity style={styles.dailyQuestionCard} onPress={onDailyQuestion} activeOpacity={0.85}>
            <Text style={styles.dailyQuestionTitle}>📌 {t('dailyQuestion.title')}</Text>
            <Text style={styles.dailyQuestionSub}>{t('dailyQuestion.cardSub')}</Text>
          </TouchableOpacity>
        ) : null}

        {onChallengeFriend ? (
          <TouchableOpacity style={styles.challengeCard} onPress={onChallengeFriend} activeOpacity={0.85}>
            <Text style={styles.challengeCardTitle}>⚔️ {t('challenge.title')}</Text>
            <Text style={styles.challengeCardSub}>{t('challenge.cardSub')}</Text>
          </TouchableOpacity>
        ) : null}

        {onVideoTour ? (
          <TouchableOpacity style={styles.challengeCard} onPress={onVideoTour} activeOpacity={0.85}>
            <Text style={styles.challengeCardTitle}>🎬 {t('videoTour.title')}</Text>
            <Text style={styles.challengeCardSub}>{t('videoTour.cardSub')}</Text>
          </TouchableOpacity>
        ) : null}

        {onChallengeWithCode ? (
          <View style={styles.enterCodeRow}>
            <Text style={styles.enterCodeLabel}>{t('challenge.enterCode')}</Text>
            <TextInput
              style={styles.enterCodeInput}
              placeholder={t('challenge.enterCodePlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={challengeCode}
              onChangeText={setChallengeCode}
            />
            <TouchableOpacity
              style={[styles.enterCodeBtn, !challengeCode.trim() && styles.enterCodeBtnDisabled]}
              onPress={() => {
                if (challengeCode.trim()) {
                  onChallengeWithCode(challengeCode.trim());
                  setChallengeCode('');
                }
              }}
              disabled={!challengeCode.trim()}
            >
              <Text style={styles.enterCodeBtnText}>{t('challenge.go')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.difficultySection}>
          <Text style={styles.sectionTitle}>{t('home.difficulty')}</Text>
          <View style={styles.difficultyRow}>
            {DIFFICULTY_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[styles.difficultyBtn, difficulty === d.id && styles.difficultyBtnActive]}
              onPress={() => setDifficulty(d.id)}
            >
              <Text style={[styles.difficultyBtnText, difficulty === d.id && styles.difficultyBtnTextActive]}>
                {t(d.titleKey)}
              </Text>
            </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.modes}>
          {MODES.map((m) => (
            <View key={m.id} style={styles.modeBlock}>
              <Button
                title={t(`modes.${m.id}.title`)}
                onPress={() => onPlay(m.id, undefined, difficulty)}
                variant="primary"
                large
                style={styles.modeButton}
              />
              <Text style={styles.modeSubtitle}>{t(`modes.${m.id}.subtitle`)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('home.playByCategory')}</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <Button
              key={c.id}
              title={t(`categories.${c.id}`)}
              onPress={() => onPlay('classic', c.id, difficulty)}
              variant="secondary"
              style={styles.categoryButton}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Button title={t('home.leaderboard')} onPress={onLeaderboard} variant="secondary" />
          <View style={styles.spacer} />
          <Button title={t('home.settings')} onPress={onSettings} variant="ghost" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.titleLarge,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  xpRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  xpText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  streakText: {
    ...typography.caption,
    color: colors.streak,
  },
  dailyQuestionCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dailyQuestionTitle: {
    ...typography.headline,
    color: colors.text,
  },
  dailyQuestionSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  challengeCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  challengeCardTitle: {
    ...typography.headline,
    color: colors.text,
  },
  challengeCardSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  enterCodeRow: {
    marginBottom: spacing.lg,
  },
  enterCodeLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  enterCodeInput: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.text,
    ...typography.body,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  enterCodeBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  enterCodeBtnDisabled: {
    opacity: 0.5,
  },
  enterCodeBtnText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  modes: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  modeBlock: {
    marginBottom: spacing.sm,
  },
  modeButton: {
    marginBottom: spacing.xs,
  },
  modeSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  categoryButton: {
    minWidth: 100,
  },
  difficultySection: {
    marginBottom: spacing.lg,
  },
  difficultyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  difficultyBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  difficultyBtnActive: {
    backgroundColor: colors.primary,
  },
  difficultyBtnText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  difficultyBtnTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  footer: {
    marginTop: spacing.lg,
  },
  spacer: { height: spacing.sm },
});
