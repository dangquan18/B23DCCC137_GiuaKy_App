import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  cardShadow,
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../theme/colors';

interface Props {
  done: number;
  total: number;
  overdue: number;
  pending: number;
  onPressOverdue: () => void;
  onPressPending: () => void;
}

export default function ProgressHeader({
  done,
  total,
  overdue,
  pending,
  onPressOverdue,
  onPressPending,
}: Props) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <View style={styles.row}>
      <View style={styles.progressCard}>
        <Text style={styles.caption}>Tiến độ · {percent}%</Text>
        <Text style={styles.bigNumber}>
          {done}
          <Text style={styles.bigNumberFaded}>/{total}</Text>
        </Text>
        <Text style={styles.label}>
          Đã hoàn thành {done}/{total} công việc
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
      </View>

      <View style={styles.sideColumn}>
        <Pressable
          onPress={onPressOverdue}
          style={({ pressed }) => [styles.statCard, styles.statOverdue, pressed && styles.pressed]}>
          <Text style={[styles.statNumber, styles.statOverdueText]}>{overdue}</Text>
          <Text style={[styles.statLabel, styles.statOverdueText]}>Quá hạn</Text>
        </Pressable>
        <Pressable
          onPress={onPressPending}
          style={({ pressed }) => [styles.statCard, styles.statPending, pressed && styles.pressed]}>
          <Text style={[styles.statNumber, styles.statPendingText]}>{pending}</Text>
          <Text style={[styles.statLabel, styles.statPendingText]}>Chưa xong</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  progressCard: {
    flex: 3,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: 'space-between',
    ...cardShadow,
  },
  caption: {
    color: colors.textOnDark,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  bigNumber: {
    color: colors.textOnDark,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.heavy,
    marginTop: spacing.xs,
  },
  bigNumberFaded: {
    color: 'rgba(255,255,255,0.55)',
  },
  label: {
    color: colors.textOnDark,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  track: {
    height: 8,
    marginTop: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.textOnDark,
  },
  sideColumn: {
    flex: 2,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  statOverdue: {
    backgroundColor: colors.dangerLight,
  },
  statOverdueText: {
    color: colors.dangerText,
  },
  statPending: {
    backgroundColor: colors.warningLight,
  },
  statPendingText: {
    color: colors.warningText,
  },
  statNumber: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.heavy,
  },
  statLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
});
