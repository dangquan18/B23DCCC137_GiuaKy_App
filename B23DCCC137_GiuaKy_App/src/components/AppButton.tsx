import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';

type Variant = 'primary' | 'dark' | 'soft' | 'dangerSoft';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  small = false,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          styles.text,
          small && styles.textSmall,
          variant === 'soft' && styles.textSoft,
          variant === 'dangerSoft' && styles.textDangerSoft,
          disabled && styles.textDisabled,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  dark: {
    backgroundColor: colors.ink,
  },
  soft: {
    backgroundColor: colors.surfaceMuted,
  },
  dangerSoft: {
    backgroundColor: colors.dangerLight,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    backgroundColor: colors.disabledBg,
  },
  text: {
    color: colors.textOnDark,
    fontSize: fontSize.body,
    fontWeight: fontWeight.heavy,
  },
  textSmall: {
    fontSize: fontSize.small,
  },
  textSoft: {
    color: colors.primary,
  },
  textDangerSoft: {
    color: colors.dangerText,
  },
  textDisabled: {
    color: colors.disabledText,
  },
});
