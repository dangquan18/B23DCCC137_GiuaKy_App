// Chuẩn hoá chuỗi tiếng Việt để tìm kiếm gần đúng (không phân biệt hoa/thường, có dấu/không dấu).

const TONE_GROUPS: [RegExp, string][] = [
  [/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a'],
  [/[èéẹẻẽêềếệểễ]/g, 'e'],
  [/[ìíịỉĩ]/g, 'i'],
  [/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o'],
  [/[ùúụủũưừứựửữ]/g, 'u'],
  [/[ỳýỵỷỹ]/g, 'y'],
  [/đ/g, 'd'],
];

/** "Hoàn Thành  Bài tập" -> "hoan thanh bai tap" */
export function normalizeText(value: string): string {
  let result = value
    .toLowerCase()
    // Bỏ dấu dạng tổ hợp (một số bàn phím gõ ra ký tự + dấu rời).
    .replace(/[̀-ͯ]/g, '');
  for (const [pattern, plain] of TONE_GROUPS) {
    result = result.replace(pattern, plain);
  }
  return result.replace(/\s+/g, ' ').trim();
}

/** Mọi từ trong từ khoá đều xuất hiện trong chuỗi, không cần đúng thứ tự hay dấu. */
export function matchesKeyword(text: string, keyword: string): boolean {
  const words = normalizeText(keyword).split(' ').filter(Boolean);
  if (words.length === 0) {
    return true;
  }
  const normalized = normalizeText(text);
  return words.every(word => normalized.includes(word));
}
