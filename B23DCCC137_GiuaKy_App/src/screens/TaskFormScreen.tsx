import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import { ScreenProps } from '../navigation/types';
import { TaskInput, TITLE_MAX_LENGTH } from '../types/task';
import { maskDateInput } from '../utils/date';
import { FormErrors, validateTask } from '../utils/task';
import AppButton from '../components/AppButton';
import CategoryPicker from '../components/CategoryPicker';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import PriorityPicker from '../components/PriorityPicker';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';

export default function TaskFormScreen({ navigation, route }: ScreenProps<'TaskForm'>) {
  const { getTask, addTask, updateTask } = useTasks();
  const insets = useSafeAreaInsets();
  const taskId = route.params?.taskId;
  const editingTask = taskId ? getTask(taskId) : undefined;
  const isNew = !taskId;

  const [form, setForm] = useState<TaskInput>(() => ({
    title: editingTask?.title ?? '',
    note: editingTask?.note ?? '',
    category: editingTask?.category ?? 'Học tập',
    priority: editingTask?.priority ?? 'Trung bình',
    dueDate: editingTask?.dueDate ?? '',
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Vị trí của form trong cửa sổ, để KeyboardAvoidingView tính đúng khi nằm dưới header.
  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  if (taskId && !editingTask) {
    return (
      <EmptyState title="Không tìm thấy công việc" message="Công việc này có thể đã bị xoá." />
    );
  }

  const updateField = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    // Sau lần bấm Lưu đầu tiên, kiểm tra lại ngay khi người dùng sửa.
    if (submitted) {
      setErrors(validateTask(next, isNew));
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    const result = validateTask(form, isNew);
    setErrors(result);
    if (Object.keys(result).length > 0) {
      return;
    }
    const input: TaskInput = {
      ...form,
      title: form.title.trim(),
      note: form.note.trim(),
      dueDate: form.dueDate.trim(),
    };
    if (taskId) {
      updateTask(taskId, input);
    } else {
      addTask(input);
    }
    navigation.goBack();
  };

  const titleLength = form.title.trim().length;

  return (
    <View
      ref={containerRef}
      style={styles.container}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, y) => setKeyboardOffset(y))
      }>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <FormField
              label="Tên công việc *"
              hint={`${titleLength}/${TITLE_MAX_LENGTH}`}
              value={form.title}
              onChangeText={text => updateField('title', text)}
              placeholder="Bạn cần làm gì?"
              error={errors.title}
              returnKeyType="next"
            />
            <FormField
              label="Hạn hoàn thành *"
              hint="dd/mm/yyyy"
              value={form.dueDate}
              onChangeText={text => updateField('dueDate', maskDateInput(text))}
              placeholder="dd/mm/yyyy"
              keyboardType="number-pad"
              maxLength={10}
              error={errors.dueDate}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Danh mục</Text>
            <CategoryPicker
              selected={form.category}
              onSelect={value => updateField('category', value)}
            />
            <Text style={[styles.label, styles.labelSpaced]}>Mức ưu tiên</Text>
            <PriorityPicker
              selected={form.priority}
              onSelect={value => updateField('priority', value)}
            />
          </View>

          <View style={styles.section}>
            <FormField
              label="Ghi chú"
              value={form.note}
              onChangeText={text => updateField('note', text)}
              placeholder="Thêm ghi chú (không bắt buộc)"
              multiline
              textAlignVertical="top"
              style={styles.noteInput}
            />
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <AppButton
            title="Huỷ"
            variant="soft"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
          <AppButton
            title={isNew ? 'Thêm công việc' : 'Lưu thay đổi'}
            variant="dark"
            onPress={handleSave}
            style={styles.flex}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  section: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.heavy,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  labelSpaced: {
    marginTop: spacing.lg,
  },
  noteInput: {
    minHeight: 90,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  cancelButton: {
    paddingHorizontal: spacing.xl,
  },
});
