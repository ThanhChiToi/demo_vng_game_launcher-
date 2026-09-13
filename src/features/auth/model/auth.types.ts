/** Đối tượng User trả về từ backend .NET. */
export interface User {
  id: string;
  username: string;
  email: string;
}

/** Payload gửi lên endpoint POST /auth/login. */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Dữ liệu trả về khi đăng nhập thành công. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Những gì AuthContext cung cấp xuống cây component. */
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** true trong lúc đang đọc phiên cũ từ secure storage lúc app khởi động. */
  isRestoring: boolean;
  login: (authData: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
}
