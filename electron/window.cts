import { BrowserWindow, app } from 'electron';
import path from 'node:path';
import { registerWindowControls } from './ipc/windowControls.ipc.cjs';

// Khi chạy dev, nạp từ Vite dev server để có HMR.
// Ghi đè bằng biến môi trường VITE_DEV_SERVER_URL nếu đổi port.
const DEV_SERVER_URL =
  process.env.VITE_DEV_SERVER_URL ?? (app.isPackaged ? null : 'http://localhost:5173');

let mainWindow: BrowserWindow | null = null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function createMainWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 940,
    minHeight: 600,
    backgroundColor: '#121212',
    frame: false,
    show: false,
    webPreferences: {
      // Khi build, preload.cjs nằm chung thư mục dist-electron với main.cjs
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      // Ghi rõ cho khỏi quên: preload chạy trong sandbox nên KHÔNG require được
      // file cục bộ. Mọi thứ preload cần phải nằm gọn trong chính preload.cts.
      sandbox: true,
    },
  });

  registerWindowControls(mainWindow);

  if (DEV_SERVER_URL) {
    void mainWindow.loadURL(DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

/** Khi user mở app lần thứ hai: khôi phục và đưa cửa sổ đang có lên trước. */
export function focusMainWindow(): void {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
}
