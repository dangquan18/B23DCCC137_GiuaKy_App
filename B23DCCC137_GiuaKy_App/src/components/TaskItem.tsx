import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';
import { daysUntil, describeDaysLeft } from '../utils/date';
import { isOverdue } from '../utils/task';
import {
  cardShadow,
  categoryColors,
  colors,
  fontSize,
  fontWeight,
  priorityColors,
  radius,
  spacing,
} from '../theme/colors';
import Checkbox from './Checkbox';
import { OverdueBadge, PriorityBadge } from './Badge';

interface Props {
  task: Task;
  onPress: (task: Task) => void;
  onLongPress: (task: Task) => void;
  onToggle: (task: Task) => void;
}

function TaskItem({ task, onPress, onLongPress, onToggle }: Props) {
  const overdue = isOverdue(task);
  const days = daysUntil(task.dueDate);
  // Độ rộng cụm nhãn ở góc, để tiêu đề chừa chỗ không bị đè.
  const [tagsWidth, setTagsWidth] = useState(0);

  let statusText = describeDaysLeft(task.dueDate);
  let statusStyle = days === 0 ? styles.statusToday : styles.statusNormal;
  if (task.done) {
    statusText = 'Đã hoàn thành';
    statusStyle = styles.statusDone;
  } else if (overdue) {
    statusText = `Trễ ${-days} ngày`;
    statusStyle = styles.statusOverdue;
  }

  return (
    <Pressable
      onPress={() => onPress(task)}
      onLongPress={() => onLongPress(task)}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.card,
        // Dải màu bên trái theo mức ưu tiên; việc đã xong thì làm mờ.
        { borderLeftColor: task.done ? colors.disabledBg : priorityColors[task.priority].bg },
        pressed && styles.cardPressed,
      ]}>
      <Checkbox checked={task.done} onToggle={() => onToggle(task)} />

      <View style={[styles.content, task.done && styles.faded]}>
        <Text
          style={[styles.title, { marginRight: tagsWidth }, task.done && styles.titleDone]}
          numberOfLines={2}>
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          <View
            style={[styles.dot, { backgroundColor: categoryColors[task.category].main }]}
          />
          <Text style={styles.meta} numberOfLines={1}>
            {task.category} · {task.dueDate}
          </Text>
          <Text style={[styles.statusText, statusStyle]}>{statusText}</Text>
        </View>
      </View>

      {/* Cụm nhãn ghim ở góc phải trên của thẻ. */}
      <View
        style={[styles.cornerTags, task.done && styles.faded]}
        onLayout={event => setTagsWidth(event.nativeEvent.layout.width)}>
        {overdue && <OverdueBadge style={styles.cornerBadge} />}
        <PriorityBadge priority={task.priority} style={styles.cornerBadge} />
      </View>
    </Pressable>
  );
}

export default React.memo(TaskItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderLeftWidth: 5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
    ...cardShadow,
  },
  cardPressed: {
    backgroundColor: colors.surfaceMuted,
    transform: [{ scale: 0.98 }],
  },
  faded: {
    opacity: 0.45,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm + 2,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: spacing.xs + 1,
  },
  meta: {
    flex: 1,
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  statusText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  cornerTags: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    overflow: 'hidden',
    // Khớp với góc bo của thẻ (trừ 1px viền).
    borderTopRightRadius: radius.md - 1,
    borderBottomLeftRadius: radius.sm + 2,
  },
  cornerBadge: {
    borderRadius: 0,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  statusNormal: {
    color: colors.primary,
  },
  statusToday: {
    color: colors.warningText,
  },
  statusOverdue: {
    color: colors.danger,
  },
  statusDone: {
    color: colors.primary,
  },
});
