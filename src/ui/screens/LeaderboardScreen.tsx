import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography } from '../theme';
import { getLeaderboard } from '../../leaderboard/leaderboard';
import type { LeaderboardPeriod } from '../../logic/types';
import type { LeaderboardEntry } from '../../logic/types';
import { LEADERBOARD_PERIODS } from '../../constants/gameConstants';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const ITEM_HEIGHT = 56;

function LeaderboardRow({ item, anonymousLabel }: { item: LeaderboardEntry; anonymousLabel: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {item.name || anonymousLabel}
      </Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );
}

const MemoizedRow = React.memo(LeaderboardRow);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.md },
  tabs: { flexDirection: 'row' as const, gap: spacing.lg },
  tabTouch: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  tab: { ...typography.body, color: colors.textSecondary },
  tabActive: { color: colors.primary, fontWeight: '600' as const },
  list: { padding: spacing.lg, paddingBottom: 80 },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center' as const, marginTop: spacing.xl },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: ITEM_HEIGHT,
  },
  rank: { ...typography.headline, color: colors.textSecondary, width: 36 },
  name: { flex: 1, ...typography.body, color: colors.text },
  score: { ...typography.headline, color: colors.primary },
  footer: { padding: spacing.lg, position: 'absolute' as const, bottom: 0, left: 0, right: 0, backgroundColor: colors.background },
  backTouch: { alignSelf: 'flex-start', paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  back: { ...typography.body, color: colors.primary },
});

export const LeaderboardScreen = React.memo(function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = React.useState<LeaderboardPeriod>('all_time');
  const entries = useMemo(() => getLeaderboard(period), [period]);

  const keyExtractor = useCallback((item: LeaderboardEntry) => item.id, []);
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }),
    []
  );
  const anonymousLabel = t('leaderboard.anonymous');
  const renderItem = useCallback(
    ({ item }: { item: LeaderboardEntry }) => <MemoizedRow item={item} anonymousLabel={anonymousLabel} />,
    [anonymousLabel]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('leaderboard.title')}</Text>
        <View style={styles.tabs}>
          {LEADERBOARD_PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              onPress={() => setPeriod(p.key)}
              style={styles.tabTouch}
              activeOpacity={0.7}
            >
              <Text style={[styles.tab, period === p.key && styles.tabActive]}>
                {t(`leaderboard.${p.key}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={entries}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={true}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('leaderboard.empty')}</Text>
        }
        renderItem={renderItem}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={onBack} style={styles.backTouch} activeOpacity={0.7}>
          <Text style={styles.back}>{t('leaderboard.back')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});
