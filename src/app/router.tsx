import { createHashRouter, Navigate } from 'react-router-dom';
import { DashboardPage } from '@/features/library';
import { AppLayout } from './layout/AppLayout/AppLayout';
import { LoginRoute } from './routes/LoginRoute';
import { RequireAuth } from './routes/RequireAuth';

/**
 * Bắt buộc dùng createHashRouter chứ không phải createBrowserRouter:
 * bản đóng gói nạp giao diện qua file:// nên history API không hoạt động.
 *
 * AppLayout bọc NGOÀI CÙNG, kể cả màn hình đăng nhập: cửa sổ dùng frame: false
 * nên nếu route nào không có TitleBar thì user không kéo hay đóng cửa sổ được.
 */
export const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/login', element: <LoginRoute /> },

      // Mọi route đặt bên trong RequireAuth đều yêu cầu đã đăng nhập.
      {
        element: <RequireAuth />,
        children: [{ index: true, element: <DashboardPage /> }],
      },

      // Đường dẫn lạ thì đưa về trang chủ.
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
