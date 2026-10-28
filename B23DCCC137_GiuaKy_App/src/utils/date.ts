// Các hàm xử lý ngày theo định dạng dd/mm/yyyy.

const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Trả về Date (00:00 giờ địa phương) nếu chuỗi đúng định dạng và là ngày có thật, ngược lại null. */
export function parseDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || year < 1900) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  // new Date tự "tràn" ngày sai (31/02 -> 03/03), nên so sánh lại để loại bỏ.
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}

const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

/** VD: "Thứ Tư, 28/10/2026". */
export function formatLongDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${formatDate(date)}`;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Số ngày từ hôm nay đến hạn (âm nếu đã quá hạn). */
export function daysUntil(dueDate: string): number {
  const due = parseDate(dueDate);
  if (!due) {
    return 0;
  }
  // Dùng Math.round để không bị lệch khi đổi giờ mùa hè.
  return Math.round((due.getTime() - startOfToday().getTime()) / MS_PER_DAY);
}

export function describeDaysLeft(dueDate: string): string {
  const days = daysUntil(dueDate);
  if (days > 0) {
    return `Còn ${days} ngày`;
  }
  if (days === 0) {
    return 'Hạn hôm nay';
  }
  return `Quá hạn ${-days} ngày`;
}

/** Tự chèn dấu "/" khi người dùng gõ số: 01022026 -> 01/02/2026. */
export function maskDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
