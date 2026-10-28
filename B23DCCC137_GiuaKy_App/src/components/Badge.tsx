import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Category, Priority } from '../types/task';
import {
  categoryColors,
  colors,
  fontSize,
  fontWeight,
  priorityColors,
  radius,
  spacing,
} from '../theme/colors';

interface Props {
  label: string;
  color: string;
  backgroundColor: string;
  style?: StyleProp<ViewStyle>;
}

export default function Badge({ label, color, backgroundColor, style }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge
      label={category}
      color={categoryColors[category].main}
      backgroundColor={categoryColors[category].light}
    />
  );
}

interface ExtraStyle {
  style?: StyleProp<ViewStyle>;
}

export function PriorityBadge({ priority, style }: { priority: Priority } & ExtraStyle) {
  const { bg, text } = priorityColors[priority];
  return <Badge label={priority} color={text} backgroundColor={bg} style={style} />;
}

export function OverdueBadge({ style }: ExtraStyle) {
  return (
    <Badge
      label="Quá hạn"
      color={colors.textOnDark}
      backgroundColor={colors.danger}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  text: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.heavy,
  },
});
