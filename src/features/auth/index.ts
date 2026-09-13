/**
 * Public API của feature auth.
 * Feature khác chỉ được import từ đây, không được chọc thẳng vào thư mục con
 * (tương đương public-api.ts / index.ts của một Angular library).
 */
export { AuthProvider } from './model/AuthProvider';
export { useAuth } from './model/auth.context';
export { LoginForm } from './components/LoginForm/LoginForm';
export type { AuthResponse, LoginCredentials, User } from './model/auth.types';
