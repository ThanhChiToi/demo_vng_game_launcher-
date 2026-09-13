import { app, BrowserWindow } from 'electron';
import { allowSelfSignedLocalhostInDev } from './security.cjs';
import { registerSecureStore } from './ipc/secureStore.ipc.cjs';
import { createMainWindow, focusMainWindow } from './window.cjs';

// Launcher chỉ được phép chạy một bản. Nếu user bấm mở lần nữa thì
// đưa cửa sổ đang có lên trước thay vì mở thêm một app mới.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', focusMainWindow);

  allowSelfSignedLocalhostInDev(app);

  void app.whenReady().then(() => {
    registerSecureStore();
    createMainWindow();

    // macOS: bấm vào icon ở Dock khi không còn cửa sổ nào thì mở lại.
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });

  // Windows/Linux: đóng hết cửa sổ là thoát hẳn. macOS thì app vẫn sống ở Dock.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
