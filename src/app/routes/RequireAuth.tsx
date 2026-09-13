import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Splash } from '@/shared/ui';

/** Chặn route cần đăng nhập — vai trò giống canActivate guard bên Angular. */
export function RequireAuth() {
  const { isAuthenticated, isRestoring } = useAuth();

  // Chưa đọc xong phiên cũ thì chưa được đá về /login, nếu không mỗi lần mở app
  // sẽ nháy qua màn hình đăng nhập rồi mới nhảy vào trong.
  if (isRestoring) return <Splash message="Đang khôi phục phiên đăng nhập..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
