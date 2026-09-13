import { ipcMain, type BrowserWindow } from 'electron';
import { CHANNELS } from './channels.cjs';

/**
 * Các nút thu nhỏ / phóng to / đóng của thanh title tự vẽ (BrowserWindow dùng frame: false).
 * Phóng to là toggle, và main process chủ động báo ngược về renderer mỗi khi
 * trạng thái đổi — kể cả khi user double-click thanh title hay kéo cửa sổ lên cạnh màn hình.
 */
export function registerWindowControls(window: BrowserWindow): void {
  ipcMain.on(CHANNELS.windowMinimize, () => window.minimize());
  ipcMain.on(CHANNELS.windowClose, () => window.close());

  ipcMain.on(CHANNELS.windowMaximizeToggle, () => {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  });

  ipcMain.handle(CHANNELS.windowIsMaximized, () => window.isMaximized());

  const notify = () => {
    if (window.isDestroyed()) return;
    window.webContents.send(CHANNELS.windowMaximizedChanged, window.isMaximized());
  };

  window.on('maximize', notify);
  window.on('unmaximize', notify);
}
