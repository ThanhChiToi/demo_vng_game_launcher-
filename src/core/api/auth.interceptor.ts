import type { InternalAxiosRequestConfig } from 'axios';
import { getCachedAccessToken } from '@/core/storage/authStorage';

/**
 * Tự động gắn Bearer token vào mọi request.
 * Vai trò giống HttpInterceptorFn của Angular (bản functional, không phải class).
 *
 * Đọc từ bản cache đồng bộ nên không phải await IPC ở mỗi request.
 */
export function authInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getCachedAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}
