import { createContext, useContext } from 'react';
import type { AuthContextValue } from './auth.types';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Hook truy cập phiên đăng nhập — vai trò giống inject(AuthService).
 *
 * Khác biệt quan trọng so với DI của Angular: mọi component gọi hook này sẽ
 * re-render khi context value đổi. Vì vậy chỉ để dữ liệu ít thay đổi (phiên
 * đăng nhập) ở đây, đừng nhét game list hay tiến độ download vào.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong <AuthProvider>');
  }
  return context;
}
