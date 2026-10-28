import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const STORAGE_KEY = '@giuaky/tasks';

/** Trả về null nếu chưa từng lưu (lần chạy đầu tiên). */
export async function loadTasks(): Promise<Task[] | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return null;
  }
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as Task[]) : null;
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
