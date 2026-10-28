import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORIES } from '../types/task';
import {
  categoryColors,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '../theme/colors';

interface Props {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {CATEGORIES.map(category => (
          <View
            key={category}
            style={[styles.dot, { backgroundColor: categoryColors[category].main }]}
          />
        ))}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSize.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
