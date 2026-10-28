export type Category = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';
export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string; // dd/mm/yyyy
  done: boolean;
}

export type TaskInput = Omit<Task, 'id' | 'done'>;

export type StatusFilter = 'all' | 'pending' | 'done' | 'overdue';
export type SortMode = 'dueDate' | 'priority';

export const CATEGORIES: Category[] = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'];
export const PRIORITIES: Priority[] = ['Cao', 'Trung bình', 'Thấp'];

export const TITLE_MAX_LENGTH = 50;
