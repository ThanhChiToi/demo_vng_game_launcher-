import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import type { AuthResponse } from '../types/auth';

export const Login: React.FC = () => {
  // 1. Lấy hàm 'login' từ AuthContext (Tương tự Inject AuthService bên Angular)
  const { login } = useAuth();

  // 2. Quản lý Form State bằng useState
  // Khác với Angular dùng ReactiveForms/FormGroup, React dùng từng useState riêng lẻ cho từng input
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // UI State: Quản lý trạng thái đang tải (Loading) và Lỗi (Error)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3. Hàm xử lý khi Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang mặc định của HTML Form
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Gọi API Login thực tế đến Backend (.NET 8)
      // Nếu chưa có Backend .NET 8 đang chạy, bạn có thể uncomment phần Mock API bên dưới để test UI trước
      
      const response = await axiosClient.post<AuthResponse>('/auth/login', {
        username,
        password,
      });

      // Đăng nhập thành công -> Lưu Token & User vào AuthContext
      login(response.data);
      alert('Đăng nhập thành công vào VNGGame Launcher!');

      /* === ĐOẠN CODE MOCK API (Dùng nếu chưa bật Backend .NET 8) ===
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập chờ API 1s
      login({
        accessToken: 'mock-access-token-xyz123',
        refreshToken: 'mock-refresh-token-abc456',
        user: { id: 'usr-1', username: username, email: `${username}@vng.com.vn` }
      });
      ============================================================= */

    } catch (error: any) {
      // Xử lý lỗi trả về từ API
      const msg = error.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false); // Tắt trạng thái Loading dù thành công hay thất bại
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>VNGGames Launcher</h2>
        <p style={styles.subtitle}>Đăng nhập để trải nghiệm kho trò chơi</p>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

        {/* Input Tài Khoản */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Tên tài khoản / Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Cập nhật State khi gõ phím
            required
            placeholder="Nhập tên tài khoản..."
            style={styles.input}
          />
        </div>

        {/* Input Mật Khẩu */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Nhập mật khẩu..."
            style={styles.input}
          />
        </div>

        {/* Nút Submit */}
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
        </button>
      </form>
    </div>
  );
};

// CSS Inline đơn giản tạo giao diện Dark Theme kiểu Game Launcher
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    color: '#ffffff',
    fontFamily: 'Segoe UI, sans-serif',
  },
  form: {
    width: '360px',
    padding: '30px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#ff5722', // Màu cam đặc trưng VNG
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#aaa',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    color: '#ccc',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    border: '1px solid #ff5252',
    color: '#ff5252',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '13px',
    marginBottom: '16px',
  },
};