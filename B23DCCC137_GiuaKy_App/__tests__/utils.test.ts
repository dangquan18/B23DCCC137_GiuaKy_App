import { createSampleTasks } from '../src/data/sampleTasks';
import { Task } from '../src/types/task';
import {
  addDays,
  describeDaysLeft,
  formatDate,
  maskDateInput,
  parseDate,
  startOfToday,
} from '../src/utils/date';
import { getVisibleTasks, isOverdue, validateTask } from '../src/utils/task';
import { matchesKeyword, normalizeText } from '../src/utils/text';

describe('normalizeText', () => {
  it('bỏ dấu tiếng Việt và chữ hoa', () => {
    expect(normalizeText('Hoàn Thành Bài Tập')).toBe('hoan thanh bai tap');
    expect(normalizeText('Đăng ký học phần')).toBe('dang ky hoc phan');
    expect(normalizeText('Sức khoẻ ỷ ữ ợ')).toBe('suc khoe y u o');
    // Dấu dạng tổ hợp (ký tự + dấu rời)
    expect(normalizeText('Hoàn')).toBe('hoan');
  });

  it('khớp theo từng từ', () => {
    expect(matchesKeyword('Hoàn thành bài tập React Native', 'hoan thanh')).toBe(true);
    expect(matchesKeyword('Hoàn thành bài tập React Native', 'bai tap hoan')).toBe(true);
    expect(matchesKeyword('Hoàn thành bài tập React Native', 'react vue')).toBe(false);
    expect(matchesKeyword('Bất kỳ', '   ')).toBe(true);
  });
});

const day = (offset: number) => formatDate(addDays(startOfToday(), offset));

describe('parseDate', () => {
  it('chấp nhận ngày hợp lệ, kể cả 29/02 năm nhuận', () => {
    expect(parseDate('15/08/2026')).not.toBeNull();
    expect(parseDate('29/02/2028')).not.toBeNull();
  });

  it('từ chối ngày không có thật hoặc sai định dạng', () => {
    expect(parseDate('31/02/2026')).toBeNull();
    expect(parseDate('29/02/2026')).toBeNull();
    expect(parseDate('31/04/2026')).toBeNull();
    expect(parseDate('00/01/2026')).toBeNull();
    expect(parseDate('12/13/2026')).toBeNull();
    expect(parseDate('1/2/2026')).toBeNull();
    expect(parseDate('2026-02-01')).toBeNull();
  });
});

describe('describeDaysLeft', () => {
  it('hiển thị số ngày còn lại / hôm nay / quá hạn', () => {
    expect(describeDaysLeft(day(3))).toBe('Còn 3 ngày');
    expect(describeDaysLeft(day(0))).toBe('Hạn hôm nay');
    expect(describeDaysLeft(day(-2))).toBe('Quá hạn 2 ngày');
  });
});

describe('maskDateInput', () => {
  it('tự chèn dấu /', () => {
    expect(maskDateInput('0102')).toBe('01/02');
    expect(maskDateInput('01022026')).toBe('01/02/2026');
    expect(maskDateInput('01/02/20269')).toBe('01/02/2026');
  });
});

describe('validateTask', () => {
  const base = {
    title: 'Học bài',
    note: '',
    category: 'Học tập' as const,
    priority: 'Cao' as const,
    dueDate: day(1),
  };

  it('hợp lệ khi đủ thông tin', () => {
    expect(validateTask(base, true)).toEqual({});
  });

  it('báo lỗi tên trống hoặc quá 50 ký tự', () => {
    expect(validateTask({ ...base, title: '   ' }, true).title).toBeDefined();
    expect(validateTask({ ...base, title: 'a'.repeat(51) }, true).title).toBeDefined();
    expect(validateTask({ ...base, title: 'a'.repeat(50) }, true).title).toBeUndefined();
  });

  it('báo lỗi ngày sai định dạng hoặc không có thật', () => {
    expect(validateTask({ ...base, dueDate: '31/02/2026' }, true).dueDate).toBeDefined();
    expect(validateTask({ ...base, dueDate: '01/02' }, true).dueDate).toBeDefined();
  });

  it('chỉ chặn ngày quá khứ khi thêm mới', () => {
    expect(validateTask({ ...base, dueDate: day(-1) }, true).dueDate).toBeDefined();
    expect(validateTask({ ...base, dueDate: day(-1) }, false).dueDate).toBeUndefined();
    expect(validateTask({ ...base, dueDate: day(0) }, true).dueDate).toBeUndefined();
  });
});

describe('sample tasks', () => {
  it('có ít nhất 6 việc, 1 việc đã xong và 1 việc quá hạn', () => {
    const tasks = createSampleTasks();
    expect(tasks.length).toBeGreaterThanOrEqual(6);
    expect(tasks.some(task => task.done)).toBe(true);
    expect(tasks.some(isOverdue)).toBe(true);
  });
});

describe('getVisibleTasks', () => {
  const make = (id: string, extra: Partial<Task>): Task => ({
    id,
    title: id,
    note: '',
    category: 'Cá nhân',
    priority: 'Trung bình',
    dueDate: day(1),
    done: false,
    ...extra,
  });
  const tasks = [
    make('Viết Báo Cáo', { priority: 'Thấp', dueDate: day(1) }),
    make('Đọc sách', { priority: 'Cao', dueDate: day(5) }),
    make('Nộp bài', { dueDate: day(-1) }),
    make('Tập gym', { done: true, dueDate: day(-3) }),
  ];

  it('lọc theo trạng thái', () => {
    expect(getVisibleTasks(tasks, 'done', '', 'dueDate').map(t => t.id)).toEqual(['Tập gym']);
    expect(getVisibleTasks(tasks, 'overdue', '', 'dueDate').map(t => t.id)).toEqual(['Nộp bài']);
    expect(getVisibleTasks(tasks, 'pending', '', 'dueDate')).toHaveLength(3);
  });

  it('tìm kiếm không phân biệt hoa thường', () => {
    expect(getVisibleTasks(tasks, 'all', 'báo cáo', 'dueDate').map(t => t.id)).toEqual([
      'Viết Báo Cáo',
    ]);
  });

  it('tìm kiếm gần đúng: không dấu, sai thứ tự từ, thừa khoảng trắng', () => {
    const ids = (keyword: string) =>
      getVisibleTasks(tasks, 'all', keyword, 'dueDate').map(t => t.id);
    expect(ids('bao cao')).toEqual(['Viết Báo Cáo']);
    expect(ids('  CAO   viet ')).toEqual(['Viết Báo Cáo']);
    expect(ids('doc sach')).toEqual(['Đọc sách']);
    expect(ids('nop')).toEqual(['Nộp bài']);
    expect(ids('xyz')).toEqual([]);
  });

  it('sắp xếp theo hạn hoặc theo ưu tiên', () => {
    expect(getVisibleTasks(tasks, 'pending', '', 'dueDate').map(t => t.id)).toEqual([
      'Nộp bài',
      'Viết Báo Cáo',
      'Đọc sách',
    ]);
    expect(getVisibleTasks(tasks, 'pending', '', 'priority').map(t => t.id)).toEqual([
      'Đọc sách',
      'Nộp bài',
      'Viết Báo Cáo',
    ]);
  });
});
