import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontWeight, radius } from '../theme/colors';

interface Props {
  checked: boolean;
  onToggle: () => void;
}

export default function Checkbox({ checked, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={12}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => [
        styles.box,
        checked && styles.checked,
        pressed && styles.pressed,
      ]}>
      {checked && <Text style={styles.tick}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.textMuted,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.88 }],
  },
  tick: {
    color: colors.textOnDark,
    fontSize: 13,
    lineHeight: 15,
    fontWeight: fontWeight.heavy,
  },
});
