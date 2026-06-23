import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { getAllAchievements } from '../../progression/achievements';
import { colors, spacing, typography } from '../theme';

interface AchievementsScreenProps {
  onBack: () => void;
}

const ACHIEVEMENT_KEYS: Record<string, string> = {
  first_win: 'achievements.first_win',
  streak_5: 'achievements.streak_5',
  streak_10: 'achievements.streak_10',
  streak_20: 'achievements.streak_20',
  score_10: 'achievements.score_10',
  score_50: 'achievements.score_50',
  score_100: 'achievements.score_100',
  daily_week: 'achievements.daily_week',
  ai_expert: 'achievements.ai_expert',
};

export const AchievementsScreen = React.memo(function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const { t } = useTranslation();
  const list = getAllAchievements();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← {t('settings.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('achievements.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {list.map((a) => (
          <View
            key={a.id}
            style={[styles.card, !a.unlocked && styles.cardLocked]}
          >
            <Text style={styles.icon}>{a.unlocked ? '🏆' : '🔒'}</Text>
            <View style={styles.cardBody}>
              <Text style={[styles.name, !a.unlocked && styles.textMuted]}>
                {t(ACHIEVEMENT_KEYS[a.id] + '.name')}
              </Text>
              <Text style={[styles.desc, !a.unlocked && styles.textMuted]}>
                {t(ACHIEVEMENT_KEYS[a.id] + '.desc')}
              </Text>
              {a.unlocked && (
                <Text style={styles.xp}>+{a.xpReward} XP</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
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
  backBtn: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLocked: {
    opacity: 0.75,
  },
  icon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  cardBody: {
    flex: 1,
  },
  name: {
    ...typography.headline,
    color: colors.text,
  },
  desc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  textMuted: {
    color: colors.textMuted,
  },
  xp: {
    ...typography.caption,
    color: colors.streak,
    marginTop: spacing.xs,
  },
});
