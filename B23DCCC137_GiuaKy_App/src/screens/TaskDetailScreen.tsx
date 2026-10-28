import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import { ScreenProps } from '../navigation/types';
import { daysUntil, describeDaysLeft } from '../utils/date';
import { isOverdue } from '../utils/task';
import AppButton from '../components/AppButton';
import { CategoryBadge, OverdueBadge, PriorityBadge } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import {
  cardShadow,
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../theme/colors';

type Tone = 'normal' | 'today' | 'overdue' | 'done';

export default function TaskDetailScreen({ navigation, route }: ScreenProps<'TaskDetail'>) {
  const { getTask, toggleDone, deleteTask } = useTasks();
  const insets = useSafeAreaInsets();
  const task = getTask(route.params.taskId);

  if (!task) {
    return (
      <EmptyState
        title="Không tìm thấy công việc"
        message="Công việc này có thể đã bị xoá."
      />
    );
  }

  const overdue = isOverdue(task);
  const days = daysUntil(task.dueDate);

  let tone: Tone = 'normal';
  if (task.done) {
    tone = 'done';
  } else if (days < 0) {
    tone = 'overdue';
  } else if (days === 0) {
    tone = 'today';
  }

  let statusText = 'Chưa xong';
  if (task.done) {
    statusText = 'Đã xong';
  } else if (overdue) {
    statusText = 'Quá hạn';
  }

  const confirmDelete = () => {
    Alert.alert('Xoá công việc', `Bạn có chắc muốn xoá "${task.title}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          navigation.goBack();
          deleteTask(task.id);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.badges}>
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />
            {overdue && <OverdueBadge />}
          </View>
          <Text style={[styles.title, task.done && styles.titleDone]}>{task.title}</Text>
        </View>

        <View style={styles.grid}>
          <View style={[styles.countdown, toneBox[tone]]}>
            <Text style={[styles.countdownLabel, toneText[tone]]}>Thời hạn</Text>
            <Text style={[styles.countdownValue, toneText[tone]]}>
              {task.done ? 'Đã hoàn thành' : describeDaysLeft(task.dueDate)}
            </Text>
          </View>
          <View style={styles.sideColumn}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Hạn</Text>
              <Text style={styles.infoValue}>{task.dueDate}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Trạng thái</Text>
              <Text style={styles.infoValue}>{statusText}</Text>
            </View>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.infoLabel}>Ghi chú</Text>
          <Text style={[styles.note, !task.note && styles.noteEmpty]}>
            {task.note || 'Không có ghi chú'}
          </Text>
        </View>

        <AppButton title="Xoá công việc" variant="dangerSoft" onPress={confirmDelete} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
        <AppButton
          title="Sửa"
          variant="soft"
          onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
          style={styles.editButton}
        />
        <AppButton
          title={task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          variant={task.done ? 'dark' : 'primary'}
          onPress={() => toggleDone(task.id)}
          style={styles.toggleButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  hero: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  countdown: {
    flex: 3,
    minHeight: 150,
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  countdownLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  countdownValue: {
    fontSize: fontSize.heading + 2,
    fontWeight: fontWeight.heavy,
  },
  boxNormal: { backgroundColor: colors.primaryLight },
  boxToday: { backgroundColor: colors.warning },
  boxOverdue: { backgroundColor: colors.danger },
  boxDone: { backgroundColor: colors.primary },
  textNormal: { color: colors.ink },
  textToday: { color: colors.warningText },
  textOverdue: { color: colors.textOnDark },
  textDone: { color: colors.textOnDark },
  sideColumn: {
    flex: 2,
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  infoLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
  },
  infoValue: {
    marginTop: 2,
    fontSize: fontSize.body,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
  noteCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    backgroundColor: colors.surfaceMuted,
  },
  note: {
    fontSize: fontSize.body,
    color: colors.text,
    lineHeight: 22,
  },
  noteEmpty: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  editButton: {
    paddingHorizontal: spacing.xl,
  },
  toggleButton: {
    flex: 1,
  },
});

const toneBox: Record<Tone, object> = {
  normal: styles.boxNormal,
  today: styles.boxToday,
  overdue: styles.boxOverdue,
  done: styles.boxDone,
};

const toneText: Record<Tone, object> = {
  normal: styles.textNormal,
  today: styles.textToday,
  overdue: styles.textOverdue,
  done: styles.textDone,
};
