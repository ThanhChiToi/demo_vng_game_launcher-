import React from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { TitleBar } from './components/TitleBar'; // Import TitleBar

export const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 1. Thanh TitleBar luôn nằm cố định ở trên cùng */}
      <TitleBar />

      {/* 2. Nội dung chính bên dưới */}
      <div style={{ flex: 1, position: 'relative' }}>
        {!isAuthenticated ? (
          <Login />
        ) : (
          <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', height: '100%' }}>
            <h1>VNGGames Dashboard</h1>
            <p>Xin chào, <strong>{user?.username}</strong>!</p>
            <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Đăng Xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;