import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography, animation } from './theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type AnswerType = 'real' | 'ai';

interface GameAnswerButtonProps {
  type: AnswerType;
  onPress: () => void;
  disabled?: boolean;
  highlight?: 'correct' | 'wrong' | null;
}

export const GameAnswerButton = React.memo(function GameAnswerButton({ type, onPress, disabled, highlight }: GameAnswerButtonProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (highlight === 'correct') {
      glow.value = withTiming(1, { duration: animation.normal });
    } else if (highlight === 'wrong') {
      scale.value = withSequence(
        withTiming(0.96, { duration: 80 }),
        withSpring(1, { damping: 10 })
      );
      glow.value = withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 200 }));
    } else {
      glow.value = withTiming(0, { duration: 150 });
    }
  }, [highlight]);

  const onPressIn = () => {
    if (disabled) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (_) {}
    }
    scale.value = withSpring(0.97, { damping: 15 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const isReal = type === 'real';
  const bgColor = isReal ? colors.real : colors.ai;
  const glowColor = isReal ? colors.realGlow : colors.aiGlow;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: 0.2 + glow.value * 0.4,
    shadowRadius: 12 + glow.value * 8,
    shadowColor: bgColor,
  }));

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={[styles.button, { backgroundColor: bgColor }, animatedStyle]}
    >
      <Text style={styles.text}>{isReal ? t('game.real') : t('game.ai')}</Text>
    </AnimatedTouchable>
  );
});

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  text: {
    ...typography.button,
    fontSize: 22,
    color: colors.white,
    letterSpacing: 1.2,
  },
});
