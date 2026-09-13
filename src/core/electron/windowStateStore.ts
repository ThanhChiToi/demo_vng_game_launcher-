import { windowApi } from './windowApi';

/**
 * Store nhỏ theo dõi cửa sổ đang phóng to hay không.
 *
 * Trạng thái này nằm ngoài React (do main process nắm), nên đây đúng là chỗ
 * dùng useSyncExternalStore — main process có thể đổi nó mà không qua React,
 * ví dụ khi user double-click thanh title hoặc kéo cửa sổ lên cạnh màn hình.
 */
let maximized = false;
const listeners = new Set<() => void>();

function setMaximized(next: boolean): void {
  if (next === maximized) return;
  maximized = next;
  for (const listener of listeners) listener();
}

windowApi.onMaximizedChange(setMaximized);
void windowApi.isMaximized().then(setMaximized);

export const windowStateStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: (): boolean => maximized,
};
