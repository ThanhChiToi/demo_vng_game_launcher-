/**
 * Cấu hình runtime của ứng dụng.
 * Giá trị lấy từ file .env (xem .env.example); fallback trỏ về backend .NET chạy local.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'https://localhost:7123/api',

  /**
   * Bật đăng nhập giả lập để code UI khi chưa có backend.
   * Đặt trong .env chứ đừng comment code trong component — như vậy sẽ không bao
   * giờ lỡ tay commit bản mock lên nhánh chính.
   */
  useMockAuth: import.meta.env.VITE_USE_MOCK_AUTH === 'true',
} as const;
