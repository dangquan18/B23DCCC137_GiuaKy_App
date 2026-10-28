// Bảng màu và các hằng số giao diện dùng chung cho toàn bộ ứng dụng.
import { Platform, ViewStyle } from 'react-native';
import { Category, Priority } from '../types/task';

export const colors = {
  primary: '#0FA36B',
  primaryLight: '#DDF3E9',
  ink: '#0B2E22', // xanh rất đậm: nút chính, tiêu đề

  background: '#FFFFFF',
  surfaceMuted: '#EEF3F1',
  border: '#D5E3DD',

  text: '#0B2E22',
  textSecondary: '#5F6F68',
  textMuted: '#94A39C',
  textOnDark: '#FFFFFF',

  danger: '#E01010',
  dangerLight: '#FFDCDC',
  dangerText: '#A80000',
  warning: '#F5C800',
  warningLight: '#F8F3A6',
  warningText: '#5C4D00',

  disabledBg: '#DDEBE5',
  disabledText: '#9DB5AA',
  shadow: '#0B2E22',
};

/** Màu riêng của từng danh mục: màu chính (chữ, chấm) và màu nền nhạt (thẻ). */
export const categoryColors: Record<Category, { main: string; light: string }> = {
  'Học tập': { main: '#8A1CF0', light: '#ECDDFD' },
  'Công việc': { main: '#5468F0', light: '#DCE6FC' },
  'Sức khoẻ': { main: '#E81D6A', light: '#FCDDE6' },
  'Cá nhân': { main: '#EA580C', light: '#FDE7D6' },
};

/** Nhãn ưu tiên: đỏ (Cao), vàng (Trung bình), xanh (Thấp). */
export const priorityColors: Record<Priority, { bg: string; text: string }> = {
  Cao: { bg: colors.danger, text: colors.textOnDark },
  'Trung bình': { bg: colors.warning, text: colors.warningText },
  Thấp: { bg: colors.primary, text: colors.textOnDark },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const fontSize = {
  caption: 12,
  small: 13,
  body: 15,
  title: 17,
  heading: 22,
  display: 28,
  hero: 44,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  default: {
    elevation: 3,
  },
}) as ViewStyle;

export const buttonShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  default: {
    elevation: 6,
  },
}) as ViewStyle;
