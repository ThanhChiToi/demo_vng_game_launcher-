import axios from 'axios';
import { env } from '@/core/config/env';
import { authInterceptor } from './auth.interceptor';

/** Instance axios dùng chung — tương đương HttpClient được provide ở root. */
export const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(authInterceptor);

// TODO(bước 2): thêm response interceptor bắt 401 -> gọi /auth/refresh bằng refreshToken.
