import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PRIORITIES, Priority } from '../types/task';
import {
  colors,
  fontSize,
  fontWeight,
  priorityColors,
  radius,
  spacing,
} from '../theme/colors';

interface Props {
  selected: Priority;
  onSelect: (value: Priority) => void;
}

/** Ba nút chọn mức ưu tiên; nút được chọn tô màu đỏ / vàng / xanh. */
export default function PriorityPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {PRIORITIES.map(priority => {
        const active = priority === selected;
        const { bg, text } = priorityColors[priority];
        return (
          <Pressable
            key={priority}
            onPress={() => onSelect(priority)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.option,
              active && { backgroundColor: bg, borderColor: bg },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.text, active && { color: text }]}>{priority}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  text: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.heavy,
    color: colors.textSecondary,
  },
});
