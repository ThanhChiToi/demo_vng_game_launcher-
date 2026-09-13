import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse, AuthContextType } from '../types/auth';

// 1. Khởi tạo Context với giá trị mặc định là undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Tạo Provider Component để bọc quanh App
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // useState tương tự BehaviorSubject trong RxJS
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // useEffect với array rỗng [] tương đương ngOnInit của Root Component
  // Tự động kiểm tra token lưu trong localStorage khi user F5 lại trang
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_info');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Hàm xử lý Lưu trạng thái khi Login thành công
  const login = (authData: AuthResponse) => {
    setToken(authData.accessToken);
    setUser(authData.user);

    // Lưu vào bộ nhớ trình duyệt (Nên thay bằng SafeStorage của Electron sau này)
    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    localStorage.setItem('user_info', JSON.stringify(authData.user));
  };

  // Hàm Xóa trạng thái khi Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  };

  return (
    // 'value' chứa toàn bộ State và Function sẽ truyền xuống cho toàn bộ App
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token, // Biến chuỗi token thành boolean (true/false)
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook giúp Component con gọi AuthContext nhanh hơn (Tương tự inject(AuthService))
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};