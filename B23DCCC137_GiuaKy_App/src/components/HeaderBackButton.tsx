import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, fontWeight } from '../theme/colors';

export default function HeaderBackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      style={({ pressed }) => pressed && styles.pressed}>
      <Text style={styles.text}>‹ Quay lại</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
