import type { ElectronApi, SecureStoreApi } from '#electron/shared/electronApi';

declare global {
  interface Window {
    // preload.cts expose object này qua contextBridge.
    electronAPI?: ElectronApi;
  }
}

export const isRunningInElectron = (): boolean => window.electronAPI !== undefined;

/**
 * Bọc API của preload lại một lớp: khi chạy `npm run dev` trong trình duyệt thuần
 * (không có Electron) thì các hàm này là no-op thay vì nổ lỗi.
 */
export const windowApi = {
  minimize: () => window.electronAPI?.minimize(),
  maximizeToggle: () => window.electronAPI?.maximizeToggle(),
  close: () => window.electronAPI?.close(),

  isMaximized: async (): Promise<boolean> => (await window.electronAPI?.isMaximized()) ?? false,

  onMaximizedChange: (listener: (maximized: boolean) => void): (() => void) =>
    window.electronAPI?.onMaximizedChange(listener) ?? (() => undefined),
};

/** null khi không chạy trong Electron -> phía gọi phải tự có phương án dự phòng. */
export const getSecureStore = (): SecureStoreApi | null =>
  window.electronAPI?.secureStore ?? null;
