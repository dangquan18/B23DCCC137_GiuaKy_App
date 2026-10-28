import { Task } from '../types/task';
import { addDays, formatDate, startOfToday } from '../utils/date';

/** Dữ liệu mẫu cho lần chạy đầu tiên. Hạn tính theo ngày hiện tại để luôn có việc quá hạn. */
export function createSampleTasks(): Task[] {
  const today = startOfToday();
  const due = (offset: number) => formatDate(addDays(today, offset));

  return [
    {
      id: 'sample-1',
      title: 'Nộp bài tập lớn Cơ sở dữ liệu',
      note: 'Nộp file .sql và báo cáo Word lên hệ thống LMS.',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: due(-3),
      done: false,
    },
    {
      id: 'sample-2',
      title: 'Gia hạn thẻ thư viện',
      note: 'Mang theo thẻ sinh viên lên tầng 2 thư viện.',
      category: 'Cá nhân',
      priority: 'Thấp',
      dueDate: due(-1),
      done: false,
    },
    {
      id: 'sample-3',
      title: 'Tập yoga 30 phút',
      note: 'Bài giãn cơ buổi tối trước khi ngủ.',
      category: 'Sức khoẻ',
      priority: 'Trung bình',
      dueDate: due(0),
      done: false,
    },
    {
      id: 'sample-4',
      title: 'Viết báo cáo tuần cho CLB Tin học',
      note: 'Tổng hợp số thành viên tham gia buổi workshop.',
      category: 'Công việc',
      priority: 'Trung bình',
      dueDate: due(2),
      done: false,
    },
    {
      id: 'sample-5',
      title: 'Ôn thi giữa kỳ Mạng máy tính',
      note: 'Tập trung chương 4: tầng mạng, định tuyến IP.',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: due(4),
      done: false,
    },
    {
      id: 'sample-6',
      title: 'Khám răng định kỳ',
      note: 'Phòng khám gần cổng trường, hẹn lúc 9h.',
      category: 'Sức khoẻ',
      priority: 'Cao',
      dueDate: due(9),
      done: false,
    },
    {
      id: 'sample-7',
      title: 'Phỏng vấn thực tập sinh Frontend',
      note: 'Đã gửi CV và portfolio.',
      category: 'Công việc',
      priority: 'Cao',
      dueDate: due(-2),
      done: true,
    },
    {
      id: 'sample-8',
      title: 'Gọi điện về nhà',
      note: '',
      category: 'Cá nhân',
      priority: 'Thấp',
      dueDate: due(1),
      done: true,
    },
  ];
}
