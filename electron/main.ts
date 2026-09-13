import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

// Khi chạy `npm run electron:dev` app chưa được đóng gói -> nạp từ Vite dev server để có HMR.
// Có thể ghi đè bằng biến môi trường VITE_DEV_SERVER_URL nếu đổi port.
const DEV_SERVER_URL =
  process.env.VITE_DEV_SERVER_URL ?? (app.isPackaged ? null : 'http://localhost:5173');

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    frame: false,
    show: false,
    webPreferences: {
      // Khi build, preload.cjs sẽ nằm chung thư mục dist-electron với main.cjs
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (DEV_SERVER_URL) {
    mainWindow.loadURL(DEV_SERVER_URL);
  } else {
    // Trỏ chính xác ra thư mục dist chứa index.html
    mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  ipcMain.on('window-minimize', () => mainWindow?.minimize());
  ipcMain.on('window-close', () => mainWindow?.close());
});
