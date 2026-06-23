import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLast7DaysCalendar } from '../retention/dailyStreak';
import { colors, spacing, typography } from './theme';

export function WeeklyCalendar() {
  const { t, i18n } = useTranslation();
  const days = getLast7DaysCalendar();

  const label = (day: (typeof days)[0]) => {
    if (day.dayOffset === 0) return t('calendar.today');
    if (day.dayOffset === 1) return t('calendar.yesterday');
    const d = new Date(day.dateKey);
    return d.toLocaleDateString(i18n.language, { weekday: 'short' });
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t('calendar.title')}</Text>
      <View style={styles.row}>
        {days.map((day) => (
          <View key={day.dateKey} style={[styles.box, day.played && styles.boxPlayed]}>
            <Text style={[styles.boxLabel, day.played && styles.boxLabelPlayed]} numberOfLines={1}>
              {label(day)}
            </Text>
            <Text style={[styles.checkText, day.played && styles.checkTextPlayed]}>
              {day.played ? '✓' : '—'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  box: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  boxPlayed: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  boxLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  boxLabelPlayed: {
    color: colors.primary,
  },
  checkText: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  checkTextPlayed: {
    color: colors.primary,
  },
});
