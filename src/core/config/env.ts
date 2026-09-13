/**
 * Cấu hình runtime của ứng dụng.
 * Giá trị lấy từ file .env (xem .env.example); fallback trỏ về backend .NET chạy local.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'https://localhost:7123/api',
} as const;
