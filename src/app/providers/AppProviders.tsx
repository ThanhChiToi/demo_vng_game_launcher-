import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth';

/**
 * Gom toàn bộ provider cấp ứng dụng về một chỗ.
 * Vai trò giống mảng `providers` trong app.config.ts của Angular —
 * bước sau QueryClientProvider (TanStack Query) và RouterProvider sẽ bọc thêm ở đây.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
