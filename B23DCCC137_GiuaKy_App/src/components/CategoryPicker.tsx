import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, Category } from '../types/task';
import {
  categoryColors,
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../theme/colors';

interface Props {
  selected: Category;
  onSelect: (value: Category) => void;
}

/** Lưới 2x2 chọn danh mục, mỗi nút có chấm màu của danh mục. */
export default function CategoryPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {CATEGORIES.map(category => {
        const active = category === selected;
        const { main, light } = categoryColors[category];
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.option,
              active && { backgroundColor: light, borderColor: main },
              pressed && styles.pressed,
            ]}>
            <View style={[styles.dot, { backgroundColor: main }]} />
            <Text style={[styles.text, active && styles.textActive]}>{category}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
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
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  text: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.text,
    fontWeight: fontWeight.heavy,
  },
});
