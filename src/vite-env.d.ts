/// <reference types="vite/client" />

// Khai báo các biến môi trường của app (tương đương environment.ts bên Angular,
// nhưng giá trị được nạp từ file .env lúc build).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
