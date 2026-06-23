import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';

type Variant = 'primary' | 'real' | 'ai' | 'secondary' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  large?: boolean;
}

const variantStyles: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: colors.primary, text: colors.white },
  real: { bg: colors.real, text: colors.white },
  ai: { bg: colors.ai, text: colors.white },
  secondary: { bg: colors.surfaceElevated, text: colors.text },
  ghost: { bg: 'transparent', text: colors.primary },
};

export const Button = React.memo(function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  large = false,
}: ButtonProps) {
  const { bg, text } = variantStyles[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bg },
        large && styles.large,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <Text style={[styles.text, { color: text }, large && styles.textLarge, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  large: {
    minHeight: 60,
    paddingVertical: spacing.lg,
  },
  disabled: { opacity: 0.5 },
  text: {
    ...typography.button,
    color: colors.white,
  },
  textLarge: {
    fontSize: 20,
  },
});
