import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import { ScreenProps } from '../navigation/types';
import { SortMode, StatusFilter, Task } from '../types/task';
import { formatLongDate } from '../utils/date';
import { getVisibleTasks, isOverdue } from '../utils/task';
import AppButton from '../components/AppButton';
import ChipGroup, { ChipOption } from '../components/ChipGroup';
import EmptyState from '../components/EmptyState';
import ProgressHeader from '../components/ProgressHeader';
import TaskItem from '../components/TaskItem';
import {
  buttonShadow,
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../theme/colors';

const FILTER_OPTIONS: ChipOption<StatusFilter>[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chưa xong' },
  { value: 'done', label: 'Đã xong' },
  { value: 'overdue', label: 'Quá hạn' },
];

const SORT_LABELS: Record<SortMode, string> = {
  dueDate: 'Hạn gần nhất',
  priority: 'Ưu tiên Cao → Thấp',
};

export default function TaskListScreen({ navigation }: ScreenProps<'TaskList'>) {
  const { tasks, loading, toggleDone, deleteTask, deleteCompleted } = useTasks();
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<StatusFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('dueDate');

  const doneCount = useMemo(() => tasks.filter(task => task.done).length, [tasks]);
  const overdueCount = useMemo(() => tasks.filter(isOverdue).length, [tasks]);
  const visibleTasks = useMemo(
    () => getVisibleTasks(tasks, filter, keyword, sortMode),
    [tasks, filter, keyword, sortMode],
  );

  const openDetail = useCallback(
    (task: Task) => navigation.navigate('TaskDetail', { taskId: task.id }),
    [navigation],
  );

  const handleToggle = useCallback((task: Task) => toggleDone(task.id), [toggleDone]);

  const confirmDelete = useCallback(
    (task: Task) => {
      Alert.alert('Xoá công việc', `Bạn có chắc muốn xoá "${task.title}"?`, [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Xoá', style: 'destructive', onPress: () => deleteTask(task.id) },
      ]);
    },
    [deleteTask],
  );

  const confirmDeleteCompleted = () => {
    Alert.alert(
      'Xoá việc đã hoàn thành',
      `Sẽ xoá ${doneCount} công việc đã hoàn thành. Bạn có chắc không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: `Xoá ${doneCount} việc`, style: 'destructive', onPress: deleteCompleted },
      ],
    );
  };

  const toggleSort = () =>
    setSortMode(mode => (mode === 'dueDate' ? 'priority' : 'dueDate'));

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <View>
        <Text style={styles.date}>{formatLongDate(new Date())}</Text>
        <Text style={styles.screenTitle}>Công việc của tôi</Text>
      </View>

      <ProgressHeader
        done={doneCount}
        total={tasks.length}
        overdue={overdueCount}
        pending={tasks.length - doneCount}
        onPressOverdue={() => setFilter('overdue')}
        onPressPending={() => setFilter('pending')}
      />

      <View style={[styles.searchBox, searchFocused && styles.searchBoxFocused]}>
        <View style={styles.searchIcon} />
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Tìm công việc..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
        {keyword !== '' && (
          <Pressable
            onPress={() => setKeyword('')}
            hitSlop={10}
            style={({ pressed }) => pressed && styles.pressedFade}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      <ChipGroup options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />

      <View style={styles.toolbar}>
        <Pressable
          onPress={toggleSort}
          style={({ pressed }) => [styles.sortButton, pressed && styles.pressedScale]}>
          <Text style={styles.sortText} numberOfLines={1} adjustsFontSizeToFit>
            ⇅ {SORT_LABELS[sortMode]}
          </Text>
        </Pressable>
        {/* Chỉ hiện ở tab có thể chứa việc đã xong. */}
        {(filter === 'all' || filter === 'done') && (
          <AppButton
            title="Xoá việc đã hoàn thành"
            variant="dangerSoft"
            onPress={confirmDeleteCompleted}
            disabled={doneCount === 0}
            small
            style={styles.toolbarButton}
          />
        )}
      </View>

      <Text style={styles.resultText}>
        {visibleTasks.length} công việc · nhấn giữ một thẻ để xoá
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={openDetail}
            onLongPress={confirmDelete}
            onToggle={handleToggle}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          tasks.length === 0 ? (
            <EmptyState
              title="Chưa có công việc nào"
              message='Nhấn "+ Thêm việc" để tạo công việc đầu tiên.'
            />
          ) : (
            <EmptyState
              title="Không có gì ở đây cả"
              message="Thử đổi bộ lọc hoặc từ khoá tìm kiếm."
            />
          )
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 110 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <AppButton
          title="+ Thêm việc"
          variant="dark"
          onPress={() => navigation.navigate('TaskForm')}
          style={styles.addButton}
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  date: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  screenTitle: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
  },
  searchBoxFocused: {
    borderColor: colors.primary,
  },
  searchIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.textMuted,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    color: colors.text,
  },
  clearText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xs,
  },
  pressedFade: {
    opacity: 0.5,
  },
  toolbar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sortButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  pressedScale: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  sortText: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.heavy,
    color: colors.primary,
  },
  toolbarButton: {
    flex: 1.35,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  resultText: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  addButton: {
    minHeight: 56,
    ...buttonShadow,
  },
});
