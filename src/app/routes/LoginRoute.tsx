import { Navigate } from 'react-router-dom';
import { LoginForm, useAuth } from '@/features/auth';
import { Splash } from '@/shared/ui';

export function LoginRoute() {
  const { isAuthenticated, isRestoring } = useAuth();

  if (isRestoring) return <Splash message="Đang khôi phục phiên đăng nhập..." />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <LoginForm />;
}
