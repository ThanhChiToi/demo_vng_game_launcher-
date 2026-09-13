/**
 * Tên kênh IPC dùng chung giữa main process và preload.
 * Gom về một chỗ để không gõ sai chuỗi ở hai đầu.
 */
export const CHANNELS = {
  windowMinimize: 'window:minimize',
  windowMaximizeToggle: 'window:maximize-toggle',
  windowClose: 'window:close',
  windowIsMaximized: 'window:is-maximized',
  windowMaximizedChanged: 'window:maximized-changed',

  secureStoreAvailable: 'secure-store:available',
  secureStoreGet: 'secure-store:get',
  secureStoreSet: 'secure-store:set',
  secureStoreDelete: 'secure-store:delete',
} as const;
