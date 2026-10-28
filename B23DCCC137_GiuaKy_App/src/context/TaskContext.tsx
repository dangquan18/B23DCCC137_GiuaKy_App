import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createSampleTasks } from '../data/sampleTasks';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import { Task, TaskInput } from '../types/task';
import { generateId } from '../utils/task';

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  getTask: (id: string) => Task | undefined;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  toggleDone: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteCompleted: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    loadTasks()
      .catch(() => null)
      .then(stored => {
        loaded.current = true;
        setTasks(stored ?? createSampleTasks());
        setLoading(false);
      });
  }, []);

  // Lưu lại mỗi khi danh sách thay đổi (bỏ qua trước khi dữ liệu được nạp xong).
  useEffect(() => {
    if (loaded.current) {
      saveTasks(tasks).catch(error => console.warn('Không lưu được dữ liệu', error));
    }
  }, [tasks]);

  const getTask = useCallback(
    (id: string) => tasks.find(task => task.id === id),
    [tasks],
  );

  const addTask = useCallback((input: TaskInput) => {
    const task: Task = { ...input, id: generateId(), done: false };
    setTasks(prev => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, input: TaskInput) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, ...input } : task)));
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const deleteCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.done));
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      getTask,
      addTask,
      updateTask,
      toggleDone,
      deleteTask,
      deleteCompleted,
    }),
    [tasks, loading, getTask, addTask, updateTask, toggleDone, deleteTask, deleteCompleted],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks phải được dùng bên trong TaskProvider');
  }
  return context;
}
