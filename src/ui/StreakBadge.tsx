import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, typography } from './theme';

interface StreakBadgeProps {
  streak: number;
  showBonus?: boolean;
}

export const StreakBadge = React.memo(function StreakBadge({ streak, showBonus }: StreakBadgeProps) {
  const scale = useSharedValue(1);
  React.useEffect(() => {
    if (showBonus && streak > 0) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [streak, showBonus]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (streak <= 0) return null;

  return (
    <Animated.View style={[styles.badge, animatedStyle]}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
      {showBonus && (
        <Text style={styles.bonus}>+2</Text>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.streak,
    gap: spacing.xs,
  },
  fire: { fontSize: 18 },
  count: {
    ...typography.headline,
    color: colors.streak,
  },
  bonus: {
    ...typography.caption,
    color: colors.streak,
    marginLeft: spacing.xs,
  },
});
