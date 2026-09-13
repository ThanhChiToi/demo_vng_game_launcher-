import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authStorage } from '@/core/storage/authStorage';
import { AuthContext } from './auth.context';
import type { AuthResponse, User } from './auth.types';

interface Session {
  accessToken: string;
  user: User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Khôi phục phiên cũ. Phải nằm trong useEffect vì đọc secure storage đi qua
  // IPC nên là async — không thể làm trong lazy initializer của useState như
  // hồi còn dùng localStorage.
  useEffect(() => {
    let cancelled = false;

    void authStorage.read<User>().then((stored) => {
      if (cancelled) return;
      if (stored) {
        setSession({ accessToken: stored.accessToken, user: stored.user });
      }
      setIsRestoring(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (authData: AuthResponse) => {
    await authStorage.save({
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      user: authData.user,
    });
    setSession({ accessToken: authData.accessToken, user: authData.user });
  }, []);

  const logout = useCallback(async () => {
    await authStorage.clear();
    setSession(null);
  }, []);

  // useMemo để object value không bị tạo mới mỗi lần render -> tránh re-render lan ra mọi consumer.
  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.accessToken ?? null,
      isAuthenticated: session !== null,
      isRestoring,
      login,
      logout,
    }),
    [session, isRestoring, login, logout],
  );

  // React 19: dùng thẳng <AuthContext>, không còn cần <AuthContext.Provider>.
  return <AuthContext value={value}>{children}</AuthContext>;
}
