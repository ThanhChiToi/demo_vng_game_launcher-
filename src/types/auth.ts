// Định nghĩa đối tượng User trả về từ Backend
export interface User {
  id: string;
  username: string;
  email: string;
}

// Cấu trúc dữ liệu trả về khi gọi API Đăng nhập thành công
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Kiểu dữ liệu cho AuthContext (để React biết Context này có những state/hàm nào)
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
}