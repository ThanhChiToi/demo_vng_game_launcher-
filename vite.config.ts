import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Electron nạp dist/index.html qua file:// nên asset phải là đường dẫn tương đối
  base: './',
})
