import { httpClient } from '@/core/api/httpClient';
import type { AuthResponse, LoginCredentials } from '../model/auth.types';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/auth/login', credentials);
  return data;
}
