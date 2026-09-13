/**
 * Hợp đồng của object mà preload expose ra `window.electronAPI`.
 *
 * File này CHỈ chứa type (không có runtime) nên vừa được main process đọc,
 * vừa được renderer đọc mà không tạo phụ thuộc thật giữa hai bên.
 * Renderer import qua alias "#electron/*" khai trong tsconfig.app.json.
 */

export interface SecureStoreApi {
  /** false khi OS không cung cấp được credential store (một số bản Linux). */
  isAvailable: () => Promise<boolean>;
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<boolean>;
  delete: (key: string) => Promise<void>;
}

export interface ElectronApi {
  minimize: () => void;
  maximizeToggle: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  /** Trả về hàm huỷ đăng ký. */
  onMaximizedChange: (listener: (maximized: boolean) => void) => () => void;
  secureStore: SecureStoreApi;
}
