import axios from 'axios';

// Tạo Instance riêng cho Axios
const axiosClient = axios.create({
  baseURL: 'https://localhost:7123/api', // URL API .NET 8 của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Chạy trước khi mọi Request được gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy Token từ localStorage
    const token = localStorage.getItem('access_token');
    
    // Nếu có token, tự động chèn vào Header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;