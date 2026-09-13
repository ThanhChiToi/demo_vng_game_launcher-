/// <reference types="vite/client" />

// Khai báo các biến môi trường của app (tương đương environment.ts bên Angular,
// nhưng giá trị được nạp từ file .env lúc build).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** "true" để đăng nhập giả lập, không cần backend .NET chạy. */
  readonly VITE_USE_MOCK_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
