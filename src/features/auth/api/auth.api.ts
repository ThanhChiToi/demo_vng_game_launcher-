import { httpClient } from '@/core/api/httpClient';
import { env } from '@/core/config/env';
import type { AuthResponse, LoginCredentials } from '../model/auth.types';

/** Phiên giả lập dùng khi VITE_USE_MOCK_AUTH=true — cho phép code UI khi chưa có backend. */
function mockLogin(credentials: LoginCredentials): AuthResponse {
  const username = credentials.username || 'GamerVNG';
  return {
    accessToken: 'dev-mock-jwt-token-xyz-123',
    refreshToken: 'dev-mock-refresh-token',
    user: {
      id: 'mock-usr-1',
      username,
      email: `${username}@vng.com.vn`,
    },
  };
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (env.useMockAuth) {
    // Giả lập độ trễ mạng để thấy được trạng thái "Đang xử lý..." của nút submit.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockLogin(credentials);
  }

  const { data } = await httpClient.post<AuthResponse>('/auth/login', credentials);
  return data;
}
