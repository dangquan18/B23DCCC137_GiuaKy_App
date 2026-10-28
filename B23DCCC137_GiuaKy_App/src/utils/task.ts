import {
  Priority,
  SortMode,
  StatusFilter,
  Task,
  TaskInput,
  TITLE_MAX_LENGTH,
} from '../types/task';
import { daysUntil, parseDate, startOfToday } from './date';
import { matchesKeyword } from './text';

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isOverdue(task: Task): boolean {
  return !task.done && daysUntil(task.dueDate) < 0;
}

const PRIORITY_RANK: Record<Priority, number> = {
  Cao: 0,
  'Trung bình': 1,
  Thấp: 2,
};

function dueTime(task: Task): number {
  return parseDate(task.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

/** Lọc theo trạng thái + tìm theo tên (gần đúng, không dấu) + sắp xếp, áp dụng đồng thời. */
export function getVisibleTasks(
  tasks: Task[],
  filter: StatusFilter,
  keyword: string,
  sortMode: SortMode,
): Task[] {
  const filtered = tasks.filter(task => {
    if (filter === 'pending' && task.done) {
      return false;
    }
    if (filter === 'done' && !task.done) {
      return false;
    }
    if (filter === 'overdue' && !isOverdue(task)) {
      return false;
    }
    return matchesKeyword(task.title, keyword);
  });

  return filtered.sort((a, b) => {
    if (sortMode === 'priority') {
      const diff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (diff !== 0) {
        return diff;
      }
    }
    return dueTime(a) - dueTime(b);
  });
}

export type FormErrors = Partial<Record<'title' | 'dueDate', string>>;

export function validateTask(input: TaskInput, isNew: boolean): FormErrors {
  const errors: FormErrors = {};
  const title = input.title.trim();

  if (title === '') {
    errors.title = 'Vui lòng nhập tên công việc';
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Tên công việc tối đa ${TITLE_MAX_LENGTH} ký tự`;
  }

  const due = parseDate(input.dueDate);
  if (input.dueDate.trim() === '') {
    errors.dueDate = 'Vui lòng nhập hạn hoàn thành';
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input.dueDate.trim())) {
    errors.dueDate = 'Hạn phải có định dạng dd/mm/yyyy';
  } else if (!due) {
    errors.dueDate = 'Ngày không tồn tại';
  } else if (isNew && due.getTime() < startOfToday().getTime()) {
    errors.dueDate = 'Hạn không được trước ngày hôm nay';
  }

  return errors;
}
