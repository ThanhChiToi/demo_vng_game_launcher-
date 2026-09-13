import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronApi } from './shared/electronApi';

/**
 * Preload chạy trong sandbox (mặc định của Electron từ v20) nên KHÔNG require
 * được file cục bộ — chỉ 'electron' và vài built-in. Vì vậy tên kênh phải viết
 * thẳng ở đây thay vì import từ ./ipc/channels.cts.
 *
 * Để hai đầu không lệch nhau: kiểu được lấy từ channels.cts qua `typeof import(...)`,
 * vốn bị xoá sạch lúc biên dịch (không sinh require nào). Gõ sai một ký tự trong
 * chuỗi kênh là lỗi compile ngay lập tức.
 */
type ChannelMap = (typeof import('./ipc/channels.cjs'))['CHANNELS'];

const CHANNELS: ChannelMap = {
  windowMinimize: 'window:minimize',
  windowMaximizeToggle: 'window:maximize-toggle',
  windowClose: 'window:close',
  windowIsMaximized: 'window:is-maximized',
  windowMaximizedChanged: 'window:maximized-changed',

  secureStoreAvailable: 'secure-store:available',
  secureStoreGet: 'secure-store:get',
  secureStoreSet: 'secure-store:set',
  secureStoreDelete: 'secure-store:delete',
};

// Chỉ expose đúng những gì renderer cần. contextIsolation đang bật nên
// renderer không với tới được Node API nào khác ngoài object này.
const api: ElectronApi = {
  minimize: () => ipcRenderer.send(CHANNELS.windowMinimize),
  maximizeToggle: () => ipcRenderer.send(CHANNELS.windowMaximizeToggle),
  close: () => ipcRenderer.send(CHANNELS.windowClose),

  isMaximized: () => ipcRenderer.invoke(CHANNELS.windowIsMaximized) as Promise<boolean>,

  onMaximizedChange: (listener) => {
    const handler = (_event: unknown, maximized: boolean) => listener(maximized);
    ipcRenderer.on(CHANNELS.windowMaximizedChanged, handler);
    return () => ipcRenderer.off(CHANNELS.windowMaximizedChanged, handler);
  },

  secureStore: {
    isAvailable: () => ipcRenderer.invoke(CHANNELS.secureStoreAvailable) as Promise<boolean>,
    get: (key) => ipcRenderer.invoke(CHANNELS.secureStoreGet, key) as Promise<string | null>,
    set: (key, value) => ipcRenderer.invoke(CHANNELS.secureStoreSet, key, value) as Promise<boolean>,
    delete: (key) => ipcRenderer.invoke(CHANNELS.secureStoreDelete, key) as Promise<void>,
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
