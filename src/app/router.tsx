import { createHashRouter, Navigate } from 'react-router-dom';
import { DashboardPage } from '@/features/dashboard';
import { AppLayout } from './layout/AppLayout';
import { LoginRoute } from './routes/LoginRoute';
import { RequireAuth } from './routes/RequireAuth';

/**
 * Bắt buộc dùng createHashRouter chứ không phải createBrowserRouter:
 * bản đóng gói nạp giao diện qua file:// nên history API không hoạt động.
 */
export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/login', element: <LoginRoute /> },
      {
        element: <RequireAuth />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
